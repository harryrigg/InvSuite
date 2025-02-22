<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePurchaseOrderRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'supplier' => [
                'required',
                'string',
                'min:1',
                'max:255'
            ],
            'lines' => [
                'required',
                'array',
                'min:1'
            ],
            'lines.*.item_id' => [
                'required',
                'string',
                'exists:inventory_items,ulid',
            ],
            'lines.*.quantity' => [
                'required',
                'integer',
                'min:1',
            ]
        ];
    }
}
