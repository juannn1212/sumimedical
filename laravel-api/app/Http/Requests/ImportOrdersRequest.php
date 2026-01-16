<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ImportOrdersRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'file' => [
                'required',
                'file',
                'mimes:csv,txt,json',
                'max:10240', // 10MB
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'file.required' => 'El archivo es requerido.',
            'file.file' => 'El archivo debe ser válido.',
            'file.mimes' => 'El archivo debe ser CSV o JSON.',
            'file.max' => 'El archivo no debe exceder 10MB.',
        ];
    }
}
