<?php

namespace App\Imports;

use App\Models\Post;
use App\Enums\ApprovalStatus;
use App\Enums\MaterialStatus;
use App\Enums\PostStatus;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToCollection;
use PhpOffice\PhpSpreadsheet\Shared\Date as ExcelDate;


class PostsImport implements ToCollection
{
    public function collection(Collection $rows)
    {
        foreach ($rows->skip(4) as $row) {
            if ($row[0] == null || $row[1] == null)
                continue;

            $normalizeDate = function ($cell) {
                if ($cell == null)
                    return null;

                if (is_numeric($cell)) {
                    return ExcelDate::excelToDateTimeObject((float) $cell);
                }

                if ($cell instanceof \DateTime) {
                    return $cell;
                }

                return \Carbon\Carbon::createFromFormat('m/d/Y', $cell);
            };

            try {
                Post::create([
                    'reviewee_id'        => null,
                    'description'        => $row[0],
                    'category'           => $row[1],
                    'caption'            => $row[2],
                    'type'               => $row[3],
                    'planned_post_date'  => $normalizeDate($row[4]),
                    'actual_post_date'   => $normalizeDate($row[5]),
                    'post_link'          => $row[6] ?? null,
                    'source'             => $row[7],
                    'approval_status'    => $row[8] ? ApprovalStatus::fromExcel($row[8]) : ApprovalStatus::Pending,
                    'post_status'        => $row[9] ? PostStatus::fromExcel($row[9]) : PostStatus::NotStarted,
                    'material_status'    => $row[10] ? MaterialStatus::fromExcel($row[10]) : MaterialStatus::NotStarted,
                    'remarks'            => $row[11] ?? null,
                ]);
            } catch (\Exception $e) {
                Log::error("Can't parse row: " . json_encode($row) . ' | Error: ' . $e->getMessage());
            }
        }
    }
}
