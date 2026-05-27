@extends('layouts.app')

@section('title', 'Contact Us - PCQLand')

@section('content')
<div class="page-shell pcd-static-page">
    <div class="container px-0 px-sm-2">
        <header class="pcd-static-hero">
            <h1 class="pcd-static-title">Contact Us</h1>
            <p class="pcd-static-sub">Visit us in Hisar or reach us by phone or email.</p>
        </header>

        <div class="row g-4 align-items-start">
            <div class="col-lg-8">
                <article class="pcd-static-card pcd-static-prose">
                    <h2>Our address</h2>
                    <p class="pcd-contact-lines">
                        SHREE HIRA COMPUTER and COMMUNICATIONS<br>
                        SHOP NO.10, LAJPAT RAI MARKET<br>
                        OPP. ELITE CINEMA, RAILWAY ROAD<br>
                        Hisar - 125001
                    </p>
                    <p><strong>Phone:</strong> <a href="tel:9728622667">9728622667</a></p>
                    <p><strong>Email:</strong> <a href="mailto:support@pcqland.in">support@pcqland.in</a></p>
                </article>
            </div>
            <div class="col-lg-4">
                <div class="pcd-static-card" style="text-align:center;">
                    <div style="font-size:48px;color:var(--pcd-green);margin-bottom:12px;">
                        <i class="fa-solid fa-headset"></i>
                    </div>
                    <h3 style="font-size:16px;font-weight:700;margin:0 0 6px;">Technical Help</h3>
                    <p style="font-size:13px;color:var(--pcd-muted);margin:0 0 4px;">98445-39000</p>
                    <p style="font-size:13px;color:var(--pcd-muted);margin:0;">Mon - Sat, 11 AM - 7 PM</p>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
