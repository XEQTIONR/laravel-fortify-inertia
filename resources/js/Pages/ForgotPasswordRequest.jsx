import { useForm } from '@inertiajs/inertia-react'

export default function ForgotPasswordRequest () {
    const { data, setData, post, processing, errors } = useForm({
        primary_contact_number: ''
    })

    function handleSubmit(e) {
        e.preventDefault();
        post(route('forgot-password-request'));
    }

    return (
        <>
            { errors.primary_contact_number && <div> {errors.primary_contact_number} </div>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="primary_contact_number">{ trans('labels.Mobile number') }</label>
                    <input
                        type="text"
                        required
                        autoFocus
                        value={data.primary_contact_number}
                        onChange={e => setData('primary_contact_number', e.target.value)}
                    />
                </div>
                <button type="submit" disabled={processing}>
                    { trans('labels.Submit') }
                </button>
            </form>
        </>
    )
}
