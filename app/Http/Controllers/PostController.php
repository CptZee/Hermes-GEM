<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Enum;
use App\Enums\ApprovalStatus;
use App\Enums\MaterialStatus;
use App\Enums\PostStatus;
use App\Imports\PostsImport;
use App\Notifications\NewPostNotification;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Validation\ValidationException;

class PostController extends Controller
{
    public function index()
    {
        return Inertia::render('posts', [
            'posts' => Post::get(),
        ]);
    }

    public function store(Request $request)
    {
        if ($request['reviewee_id'] == null) {
            $request['reviewee_id'] = Auth::id();
        }

        $input = $request->all();

        if (is_numeric($input['material_status'])) {
            $enum = MaterialStatus::fromIndex((int) $input['material_status']);
            if ($enum === null) {
                throw ValidationException::withMessages([
                    'material_status' => ['Invalid approval status'],
                ]);
            }
            $input['material_status'] = $enum;
        }

        $validated = validator($input, [
            'reviewee_id'       => 'required|exists:users,id',
            'description'       => 'required|string|max:255',
            'category'          => 'required|string|max:100',
            'caption'           => 'required|string|max:255',
            'type'              => 'required|string|max:64',
            'planned_post_date' => 'required|date',
            'source'            => 'required|string|max:64',
            'material_status'   => ['required', new Enum(MaterialStatus::class)],
        ])->validate();

        $validated['approval_status'] = ApprovalStatus::Pending->value;
        $validated['post_status'] = PostStatus::NotStarted->value;

        try {
            $post = Post::create($validated);

            $users = User::all();
            foreach ($users as $user) {
                $user->notify(new NewPostNotification());
            }

            return back()->with('success', 'Post added.');
        } catch (\Exception $e) {
            // Log::info('VAPID_PUBLIC_KEY:', [env('VAPID_PUBLIC_KEY')]);
            // Log::info('VAPID_PRIVATE_KEY:', [env('VAPID_PRIVATE_KEY')]);
            // Log::info('VAPID_SUBJECT:', [env('VAPID_SUBJECT')]);
            Log::error($e);
            throw ValidationException::withMessages([
                'message' => ['Failed to create post'],
                'error' => $e->getMessage()
            ]);
        }
    }

    //Update post
    public function updateDetails(Request $request, $id)
    {
        $validated = $request->validate([
            'description' => ['nullable', 'string'],
            'caption' => ['nullable', 'string'],
            'category' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'max:255'],
            'planned_post_date' => ['nullable', 'date'],
            'source' => ['nullable', 'string', 'max:255'],
            'post_link' => ['nullable', 'string', 'max:2048'],
        ]);

        $post = Post::findOrFail($id);
        $post->update($validated);

        //TODO: Add notification

        return back()->with('success', 'Post details updated successfully.');
    }

    // Add a new remark to a post
    public function addRemark(Request $request, $id)
    {
        $user = $request->user();

        $input = $request->all();
        $input['id'] = $id;
        $validated = validator($input, [
            'id' => ['required', 'exists:posts,id'],
            'remark' => 'required|string|max:1000',
        ], [
            'id.exists' => 'The specified post does not exist.',
        ])->validate();

        $post = Post::find($id);

        $post->remarks .= ($post->remarks ? "\n" : "") . now()->format('Y-m-d H:i') . ' - ' . $user->name . ': ' . $validated['remark'];
        $post->save();

        return back()->with('success', 'Added remark to post.');
    }

    // Update Approval Status
    public function updateApprovalStatus(Request $request, $id)
    {
        $user = $request->user();
        $user->loadMissing('roles');

        $allowedRoles = [
            UserRole::Admin->value,
            UserRole::Reviewer->value
        ];

        $hasPermission = $user->roles->pluck('name')->intersect($allowedRoles)->isNotEmpty();

        if (!$hasPermission) {
            return response()->json(['message' => 'Unauthorized: Only reviewers or higher can add remarks.'], 403);
        }

        $input = $request->all();
        $input['id'] = $id;
        if (is_numeric($input['approval_status'])) {
            $enum = ApprovalStatus::fromIndex((int) $input['approval_status']);
            if ($enum === null) {
                throw ValidationException::withMessages([
                    'approval_status' => ['Invalid post approval status'],
                ]);
            }
            $input['approval_status'] = $enum->value;
        }

        $validated = validator($input, [
            'id' => ['required', 'exists:posts,id'],
            'approval_status' => ['required', new Enum(ApprovalStatus::class)],
        ], [
            'id.exists' => 'The specified post does not exist.',
        ])->validate();

        $post = Post::findOrFail($id);

        $post->approval_status = $validated['approval_status'];
        $post->save();

        //TODO: Add notifications

        return back()->with('success', 'Post approval status updated.');
    }

    // Update Post Status
    public function updatePostStatus(Request $request, $id)
    {
        $input = $request->all();
        $input['id'] = $id;
        if (is_numeric($input['post_status'])) {
            $enum = PostStatus::fromIndex((int) $input['post_status']);
            if ($enum === null) {
                throw ValidationException::withMessages([
                    'post_status' => ['Invalid post status'],
                ]);
            }
            $input['post_status'] = $enum->value;
        }

        $validated = validator($input, [
            'id' => ['required', 'exists:posts,id'],
            'post_status' => ['required', new Enum(PostStatus::class)],
            'post_link' => ['required'],
        ], [
            'id.exists' => 'The specified post does not exist.',
        ])->validate();

        $post = Post::findOrFail($id);

        $post->post_status = $validated['post_status'];
        $post->post_link = $validated['post_link'];
        $post->save();

        //TODO: Add notifications

        return back()->with('success', 'Post status updated.');
    }

    // Update Material
    public function updateMaterialStatus(Request $request, $id)
    {
        $input = $request->all();
        $input['id'] = $id;
        Log::info($input['material_status'] . "\n" . $id);
        if (is_numeric($input['material_status'])) {
            $enum = MaterialStatus::fromIndex((int) $input['material_status']);
            if ($enum === null) {
                throw ValidationException::withMessages([
                    'material_status' => ['Invalid approval status'],
                ]);
            }
            $input['material_status'] = $enum->value;
        }

        $validated = validator($input, [
            'id' => ['required', 'exists:posts,id'],
            'material_status' => ['required', new Enum(MaterialStatus::class)],
            'source' => ['required'],
        ], [
            'id.exists' => 'The specified post does not exist.',
        ])->validate();

        $post = Post::findOrFail($id);

        if ($post->material_status != $validated['material_status'])
            $post->approval_status = ApprovalStatus::Pending;

        $post->material_status = $validated['material_status'];
        $post->source = $validated['source'];
        $post->save();

        //TODO: Add notifications

        return back()->with('success', 'Post material status updated.');
    }

    public function importExcel(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv',
        ]);

        Excel::import(new PostsImport, $request->file('file'));
        return back()->with('success', 'Posts imported.');
    }
}
