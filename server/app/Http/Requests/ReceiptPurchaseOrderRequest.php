<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReceiptPurchaseOrderRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'adjusted_lines' => [
                'array',
            ],
            'adjusted_lines.*.index' => [
                'required',
                'integer',
            ],
            'adjusted_lines.*.quantity' => [
                'required',
                'integer',
                'min:0',
            ]
        ];
    }
}
