<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        // Event listeners can be registered here.
    ];

    public function boot(): void
    {
        parent::boot();
    }
}
