<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdjustmentRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'type' => ['required', Rule::in(['set', 'add', 'subtract'])],
            'amount' => ['required', 'integer', $this->amountMinRule()],
            'reason' => ['required', 'string', 'max:255'],
        ];
    }

    private function amountMinRule(): string
    {
        return match ($this['type']) {
            'set' => 'min:0',
            'add', 'subtract' => 'min:1',
            default => ''
        };
    }
}
