import { useForm } from '@inertiajs/inertia-react'

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        primary_contact_number: '',
        secondary_contact_number: '',
        password: '',
        password_confirmation: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('register'));
    }
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">{trans('labels.Name')}</label>
                <input
                    id="name"
                    type="text"
                    required
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    autoFocus
                />
                { errors.name && <div>{ errors.name }</div> }
            </div>

            <div>
                <label htmlFor="email">{trans('labels.Email')}</label>
                <input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={e => setData('email', e.target.value)}
                />
                { errors.email && <div>{ errors.email }</div> }
            </div>

            <div className="mt-4">
                <label htmlFor="primary_contact_number">{trans('labels.Mobile number')}</label>
                <input
                    id="primary_contact_number"
                    type="tel"
                    value={data.primary_contact_number}
                    onChange={e => setData('primary_contact_number', e.target.value)}
                    required
                />
                { errors.primary_contact_number && <div>{ errors.primary_contact_number }</div> }
            </div>

            <div className="mt-4">
                <label htmlFor="secondary_contact_number">{trans('labels.Other contact number')}</label>
                <input
                    type="tel"
                    value={data.secondary_contact_number}
                    onChange={e => setData('secondary_contact_number', e.target.value)}
                />
                { errors.secondary_contact_number && <div>{ errors.secondary_contact_number }</div> }
            </div>

            <div className="mt-4">
                <label htmlFor="password">{trans('labels.Password')}</label>
                <input
                    type="password"
                    value={data.password}
                    onChange={e => setData('password', e.target.value)}
                    required
                />
                { errors.password && <div>{ errors.password }</div> }
            </div>
            <div className="mt-4">
                <label htmlFor="password">{trans('labels.Confirm password')}</label>
                <input
                    type="password"
                    value={data.password_confirmation}
                    onChange={e => setData('password_confirmation', e.target.value)}
                    required
                />
            </div>

            <div>
                <button
                    type="submit"
                    disabled={processing}
                >
                    { trans('labels.Register') }
                </button>
            </div>
        </form>
    )
}
