import { useForm } from '@inertiajs/inertia-react'

export default function ResetPassword ({ code }) {
    const {data, setData, post, processing, errors} = useForm({
        password: '',
        password_confirmation: ''
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('reset-password-new', { code }));
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="password">{ trans('labels.New password') }</label>
                <input
                    type="password"
                    required
                    autoFocus
                    value={data.password}
                    onChange={e => setData('password', e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="password_confirmation">{ trans('labels.Confirm new password') }</label>
                <input
                    type="password"
                    required
                    autoFocus
                    value={data.password_confirmation}
                    onChange={e => setData('password_confirmation', e.target.value)}
                />
            </div>
            <button type="submit" disabled={processing}>
                { trans('labels.Submit') }
            </button>
        </form>
    )
}
