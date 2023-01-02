import { useForm } from '@inertiajs/inertia-react'

export default function ForgotPasswordRequest ({code_mismatch_message}) {
    const {data, setData, post, processing, errors} = useForm({
        code: ''
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('forgot-password-code'));
    }

    return (
        <>
            { code_mismatch_message && <div> {code_mismatch_message} </div>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="code">{ trans('labels.Verification code') }</label>
                    <input
                        type="text"
                        required
                        autoFocus
                        value={data.code}
                        onChange={e => setData('code', e.target.value)}
                    />
                </div>
                <button type="submit" disabled={processing}>
                    { trans('labels.Submit') }
                </button>
            </form>
        </>
    )

}
