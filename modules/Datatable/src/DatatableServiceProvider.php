<?php

namespace Modules\Datatable;

use Illuminate\Support\ServiceProvider;
use Inertia\Response;

class DatatableServiceProvider extends ServiceProvider
{
    public function boot()
    {
        $this->mergeConfigFrom(__DIR__.'/../config/datatable.php', 'datatable');

        Response::macro('getQueryBuilder', fn () => $this->props['queryBuilder'] ?? []);

        Response::macro('table', function (callable $tableBuilder) {
            $table = new Table(request());
            $tableBuilder($table);

            return $table->apply($this);
        });
    }
}
