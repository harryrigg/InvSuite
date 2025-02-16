<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PurchaseOrderRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'reference' => [
                'nullable',
                'min:1',
                'max:16',
                'regex:/^[a-zA-Z]\S*$/', // Custom references must start with a letter (to distinguish from auto-generated references)
                'unique:purchase_orders'
            ],
            'supplier' => [
                'required',
                'string',
                'min:1',
                'max:255'
            ],
        ];
    }
}
