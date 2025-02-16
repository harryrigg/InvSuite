<?php

namespace App\Providers;

use App\Http\Resources\Resource;
use App\Models\InventoryItem;
use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Resource::withoutWrapping();

        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            return config('app.frontend_url') . "/password-reset/$token?email={$notifiable->getEmailForPasswordReset()}";
        });

        Route::model('inventory', InventoryItem::class);

        Gate::define('access-inventory-item', function (User $user, InventoryItem $inventoryItem) {
            return $inventoryItem->user->is($user);
        });
    }
}
