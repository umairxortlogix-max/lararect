import { Form, Head } from '@inertiajs/react';
import { LockKeyhole, UserRound } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import PasskeyVerify from '@/components/passkey-verify';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Log in" />

            <PasskeyVerify />

            <Form
                action={store.url()}
                method="post"
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            <div className="grid gap-2">
                                <Label className="text-sm font-medium text-[#1f2937]" htmlFor="email">
                                    Username
                                </Label>
                                <div className="relative">
                                    <UserRound className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-[#128c7e]" />
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="Username"
                                        className="h-12 rounded-xl border-[#e5e7eb] bg-[#f5f7f8] pl-11 text-[#1f2937] placeholder:text-[#6b7280] focus-visible:border-[#25d366] focus-visible:ring-[#25d366]/20"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label className="text-sm font-medium text-[#1f2937]" htmlFor="password">
                                        Password
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-xs text-[#128c7e] hover:text-[#075e54]"
                                            tabIndex={5}
                                        >
                                            Forgot Password?
                                        </TextLink>
                                    )}
                                </div>
                                <div className="relative">
                                    <LockKeyhole className="pointer-events-none absolute top-1/2 left-4 z-10 size-[18px] -translate-y-1/2 text-[#128c7e]" />
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Password"
                                        className="h-12 rounded-xl border-[#e5e7eb] bg-[#f5f7f8] pl-11 text-[#1f2937] placeholder:text-[#6b7280] focus-visible:border-[#25d366] focus-visible:ring-[#25d366]/20"
                                    />
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="border-[#d1d5db] bg-white data-[state=checked]:border-[#25d366] data-[state=checked]:bg-[#25d366] data-[state=checked]:text-white"
                                />
                                <Label className="text-sm text-[#6b7280]" htmlFor="remember">
                                    Remember me
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-3 h-12 w-full rounded-xl bg-[#25d366] text-sm font-semibold tracking-[0.18em] text-white shadow-[0_8px_24px_rgba(37,211,102,0.24)] transition-all hover:bg-[#128c7e] hover:shadow-[0_10px_30px_rgba(18,140,126,0.28)]"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Log in
                            </Button>
                        </div>

                        <div className="text-center text-sm text-[#6b7280]">
                            Don't have an account?{' '}
                            <TextLink href={register()} className="text-[#128c7e] hover:text-[#075e54]" tabIndex={5}>
                                Sign up
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-[#128c7e]">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Log in to your account',
    description: 'Enter your email and password below to log in',
};
