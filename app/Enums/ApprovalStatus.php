<?php

namespace App\Enums;

enum ApprovalStatus: string
{
    case Pending = 'pending';
    case Approved = 'approved';
    case Rejected = 'rejected';
    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Admin',
            self::Approved => 'Approved',
            self::Rejected => 'Rejected',
        };
    }

    public static function fromIndex(int $index): ?self
    {
        return match ($index) {
            0 => self::Pending,
            1 => self::Approved,
            2 => self::Rejected,
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
            "pending review" => self::Pending,
            "Approved" => self::Approved,
            "Rejected" => self::Rejected,
            default => null,
        };
    }
}
