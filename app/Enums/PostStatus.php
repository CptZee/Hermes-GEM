<?php

namespace App\Enums;

enum PostStatus: string
{
    case Posted = 'posted';
    case Pending = 'pending';
    case Delayed = 'delayed';
    case NotStarted = 'notStarted';
    public function label(): string
    {
        return match ($this) {
            self::Posted => 'Posted',
            self::Pending => 'Pending',
            self::Delayed => 'Delayed',
            self::NotStarted => 'NotStarted',
        };
    }

    public static function fromIndex(int $index): ?self
    {
        return match ($index) {
            0 => self::Posted,
            1 => self::Pending,
            2 => self::Delayed,
            3 => self::NotStarted,
            default => null,
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function fromExcel(string $string): ?self
    {
        return match ($string) {
            "Posted" => self::Posted,
            "Pending" => self::Pending,
            "Delayed" => self::Delayed,
            "Not Started" => self::NotStarted,
            default => null,
        };
    }
}
