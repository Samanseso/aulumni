<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    
    public function rules(): array
    {
        $userId = $this->route('user')?->user_id;

        return [
            'user_name' => ['required', 'string', 'max:255'],
            'name'      => ['required', 'string', 'max:255'],
            'status'    => ['nullable', 'string', 'in:active,pending,inactive'], 
        ];
    }
}
