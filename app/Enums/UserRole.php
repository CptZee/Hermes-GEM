<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin = 'admin';
    case Reviewer = 'reviewer';
    case Lead = 'lead';
    case Reviewee = 'reviewee';

    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Admin',
            self::Reviewer => 'Reviewer',
            self::Lead => 'Lead',
            self::Reviewee => 'Reviewee',
        };
    }
}
