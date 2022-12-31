import { useForm } from '@inertiajs/inertia-react'

export default function Login () {

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    })

    function handleSubmit(e) {
        e.preventDefault();
        post(route('login'),{
            onError: () => setData('password', '')
        });
    }
    return (
        <>
            { errors.email && <div>{ errors.email }</div> }
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">{ trans('labels.Email or phone number') }</label>
                    <input
                        type="text"
                        required
                        autoFocus
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                    />
                </div>

                <div className="mt-4">
                    <label htmlFor="password">{ trans('labels.Password') }</label>
                    <input
                        type="password"
                        required
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                    />
                </div>

                <div className="block mt-4">
                    <label htmlFor="remember">
                    <input
                        type="checkbox"
                        checked={data.remember}
                        onChange={e => setData('remember', e.target.value)}
                    />
                        { trans('labels.Remember me')}
                    </label>
                </div>



                <div>
                    <button
                        type="submit"
                        disabled={processing}
                    >
                        { trans('labels.Log in') }
                    </button>
                </div>
            </form>
        </>
    );
}
