<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>
        

        {{-- SEO --}}
        <title inertia>{{ config('app.name', 'VPS Manager') }}</title>
        <meta name="description" content="">
        <meta name="author" content="Hakim Fidjel">
        <meta name="keywords" content="">

        {{-- <meta name="og:site-name" content="hakimfidjel.fr">
        <meta name="og:description" content="Portfolio of Hakim Fidjel, a FullStack engineering apprentice. Discover my projects, skills, and ambitions across the diverse fields of computer engineering.">
        <meta name="og:type" content="website">
        <meta name="og:url" content="https://hakimfidjel.fr">
        <meta name="og:image" content="https://hakimfidjel.fr/favicon.png"> --}}

        {{-- Favicon --}}
        <link rel="icon" href="{{ asset('favicon.png') }}" type="image/x-icon" />

        {{-- Font --}}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&display=swap" rel="stylesheet">

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', 'resources/css/app.css', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead

    </head>

    <body class="font-sans antialiased">
        @inertia
    </body>

</html>
