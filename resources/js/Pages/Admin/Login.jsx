import React  from 'react';
import { useForm } from '@inertiajs/inertia-react';
import { Button, Box, Checkbox, FormGroup, FormControlLabel, Paper, Stack, TextField, Typography } from '@mui/material';

export default function Login ({ loginRoute }) {

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    })

    function handleLogin(e) {
        e.preventDefault();
        post( loginRoute ?? route('login'),{
            onError: () => setData('password', '')
        });
    }

    return (
            <Box className="w-full h-full flex flex-col items-center">
                <Paper className="p-5 mt-5" elevation={5}>
                    <form onSubmit={handleLogin}>
                        <Stack
                            sx={{ minWidth: "300px"}}
                            spacing={2}>
                            <Typography  align="center">Log in to continue</Typography>


                            { errors.email &&  <Typography variant="caption" className="text-red-400">{ errors.email }</Typography> }

                            <TextField
                                size="small"
                                required
                                autoFocus
                                label={trans('labels.Email')}
                                defaultValue={data.email}
                                onChange={e => setData('email', e.target.value)}
                            />
                            <TextField
                                size="small"
                                required
                                autoFocus
                                label={trans('labels.Password')}
                                type="password"
                                defaultValue={data.password}
                                onChange={e => setData('password', e.target.value)}
                            />

                            <FormGroup>
                                <FormControlLabel control={
                                    <Checkbox
                                        defaultChecked={data.remember}
                                        onChange={e => setData('remember', e.target.value)}
                                    />
                                } label={ trans('labels.Remember me')} />
                            </FormGroup>



                            <Button
                                variant="contained"
                                type="submit"
                                disabled={processing}
                            >
                                { trans('labels.Log in') }
                            </Button>
                        </Stack>
                    </form>
                </Paper>
            </Box>
    );
}
