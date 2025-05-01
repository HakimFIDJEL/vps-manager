@component('mail::message')
# Modifiez votre mot de passe, {{ $user->firstname }} {{ $user->lastname }}

Vous avez demandé à réinitialiser votre mot de passe sur **{{ env('APP_NAME') }}**.

Cliquez sur le lien suivant pour modifier votre mot de passe. Ce lien expirera dans 24 heures.

@component('mail::button', ['url' => route('auth.password.reset', ['password_token' => $user->password_token])])
Modifier Mon Mot de Passe
@endcomponent

Si vous n'avez pas initié cette demande, veuillez ignorer cet e-mail.

@component('mail::subcopy')
Merci de votre confiance,

**L'équipe {{ env('APP_NAME') }}**
@endcomponent


@endcomponent
