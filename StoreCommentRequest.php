<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCommentRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string|min:3|max:2000',
            'article_type' => 'required|string|max:100',
            'article_key' => 'required|string|max:255',
            'captcha_token' => 'required|string',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The name field is required.',
            'name.string' => 'The name must be a string.',
            'name.max' => 'The name may not be greater than 255 characters.',

            'email.required' => 'The email field is required.',
            'email.email' => 'The email must be a valid email address.',
            'email.max' => 'The email may not be greater than 255 characters.',

            'message.required' => 'The message field is required.',
            'message.string' => 'The message must be a string.',
            'message.min' => 'The message must be at least 3 characters.',
            'message.max' => 'The message may not be greater than 2000 characters.',

            'article_type.required' => 'The article type field is required.',
            'article_type.string' => 'The article type must be a string.',
            'article_type.max' => 'The article type may not be greater than 100 characters.',

            'article_key.required' => 'The article key field is required.',
            'article_key.string' => 'The article key must be a string.',
            'article_key.max' => 'The article key may not be greater than 255 characters.',

            'captcha_token.required' => 'The captcha token field is required.',
            'captcha_token.string' => 'The captcha token must be a string.',
        ];
    }
}
