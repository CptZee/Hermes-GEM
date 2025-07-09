<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create("posts", function (Blueprint $table) {
            $table->id();
            $table->foreignId('reviewee_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string("description", length: 255);
            $table->string("category", length: 100);
            $table->string("caption", length: 255)->nullable();
            $table->string("type", length: 64);
            $table->date("planned_post_date");
            $table->date("actual_post_date")->nullable();
            $table->string("post_link")->nullable();
            $table->string("source")->nullable();
            $table->text("approval_status");
            $table->text("post_status");
            $table->text("material_status");
            $table->text("remarks")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("posts");
    }
};
