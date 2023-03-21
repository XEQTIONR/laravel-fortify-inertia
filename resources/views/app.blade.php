<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <script src="{{ route('translations') }}"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;700&family=Noto+Sans+Bengali:wght@400;700&family=Noto+Serif+Bengali&display=swap" rel="stylesheet">
    <style>
        .order-created .MuiStepLabel-iconContainer.Mui-active.MuiStepLabel-alternativeLabel::after{
            content: '';
            display: block;
            position: absolute;
            width:24px;
            height:24px;
            top: 0;
            bottom: 0;
            animation: pulse2 4s infinite;
            border-radius: 50%;
            border: 4px solid #1876D1;
        }

        @keyframes pulse2 {
            0% {
                transform: scale(1, 1);
                opacity: 0;
            }

            25% {
                opacity: .7;
            }

            50% {
                transform: scale(1.5, 1.5);
                opacity: 0;
            }
            100% {
                transform: scale(1, 1);
                opacity: 0;
            }
        }
    </style>
    @routes
    @viteReactRefresh
    @vite('resources/js/app.jsx')
    @inertiaHead
</head>
<body>
@inertia
</body>
</html>
