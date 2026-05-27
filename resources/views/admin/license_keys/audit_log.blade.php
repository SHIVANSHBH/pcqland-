@extends('layouts.app')

@section('title', 'Audit Log - License Key Batches')

@section('content')
<div class="container mt-4">
    <div class="row">
        <div class="col-12">
            <h2 class="mb-4">License Key Batch Audit Log</h2>

            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Admin</th>
                        <th>Action</th>
                        <th>Batch ID</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($logs as $log)
                        <tr>
                            <td>{{ $log->created_at->format('d M Y H:i') }}</td>
                            <td>{{ $log->user?->name ?? 'System' }}</td>
                            <td><span class="badge bg-primary">{{ ucfirst($log->action) }}</span></td>
                            <td>#{{ $log->model_id }}</td>
                            <td>
                                @if($log->changes)
                                    <small>{{ implode(', ', array_keys($log->changes)) }}</small>
                                @endif
                            </td>
                        </tr>
                    @empty
                        <tr><td colspan="5" class="text-center text-muted">No audit logs found.</td></tr>
                    @endforelse
                </tbody>
            </table>

            {{ $logs->links() }}

            <a href="{{ route('admin.license-keys.index') }}" class="btn btn-secondary mt-3">Back to License Keys</a>
        </div>
    </div>
</div>
@endsection
