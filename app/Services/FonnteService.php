<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FonnteService
{
    protected ?string $token;

    protected ?string $url;

    public function __construct()
    {
        $this->token = config('services.fonnte.token');
        $this->url = config('services.fonnte.url');
    }

    public function send(string $phone, string $message): bool
    {
        if (empty($this->token) || empty($this->url)) {
            Log::warning('Fonnte skipped: FONNTE_TOKEN or FONNTE_URL is not configured.');

            return false;
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => $this->token,
            ])->post($this->url, [
                'target' => $phone,
                'message' => $message,
            ]);

            return $response->successful();
        } catch (\Throwable $e) {
            Log::error('Fonnte Error', [
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }
}
