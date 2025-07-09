<?php

namespace App\Enums;

enum MaterialStatus: string
{
    case Completed = 'completed';
    case InProgress = 'inProgress';
    case Delayed = 'delayed';
    case NotStarted = 'notStarted';
    public function label(): string
    {
        return match ($this) {
            self::Completed => 'Completed',
            self::InProgress => 'InProgress',
            self::Delayed => 'Delayed',
            self::NotStarted => 'NotStarted',
        };
    }

    public static function fromIndex(int $index): ?self
    {
        return match ($index) {
            0 => self::Completed,
            1 => self::InProgress,
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
            "Completed" => self::Completed,
            "Inprogress" => self::InProgress,
            "Delayed" => self::Delayed,
            "Not Started" => self::NotStarted,
            default => null,
        };
    }
}
