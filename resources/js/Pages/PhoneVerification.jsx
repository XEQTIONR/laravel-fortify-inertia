import { useForm } from '@inertiajs/inertia-react'

export default function PhoneVerification () {
    const { data, setData, post, processing, errors } = useForm({
        verification_code: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('verify-phone-code'));
    }

    return (
        <>
            { errors.verification_code && <div>{ errors.verification_code }</div> }
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="verification_code">{trans('labels.Verification code')}</label>
                    <input
                        id="name"
                        type="text"
                        required
                        value={data.verification_code}
                        onChange={e => setData('verification_code', e.target.value)}
                        autoFocus
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={processing}
                    >
                        { trans('labels.Verify') }
                    </button>

                    <button
                        type="button"
                        disabled={processing}
                    >
                        { trans('labels.Resend verification code') }
                    </button>
                </div>
            </form>
        </>
    )
}
