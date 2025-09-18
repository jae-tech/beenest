import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../hooks/useAuth";
import { loginSchema, type LoginFormData } from "../schemas/loginSchema";
import LogoSvg from "/logo.svg";

export function LoginForm() {
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@beenest.com",
      password: "admin123!",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    try {
      await login(data);
      // 로그인 성공 시 대시보드로 이동
      navigate({ to: '/dashboard' });
    } catch (error) {
      // 에러는 authStore에서 처리됨
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center mb-4 mx-auto">
            <img src={LogoSvg} alt="Beenest Logo" />
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일 주소</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="이메일을 입력하세요"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <label className="flex items-center space-x-2 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={field.value || false}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="rounded border-gray-300 text-yellow-400 focus:ring-yellow-400"
                      />
                      <span>로그인 상태 유지</span>
                    </label>
                  )}
                />
                <button
                  type="button"
                  className="text-sm text-yellow-600 hover:text-yellow-700 font-medium cursor-pointer"
                >
                  비밀번호를 잊으셨나요?
                </button>
              </div>

              {(form.formState.errors.root || error) && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">
                    {form.formState.errors.root?.message || error}
                  </p>
                </div>
              )}

              <LoadingButton
                type="submit"
                loading={form.formState.isSubmitting || isLoading}
                disabled={form.formState.isSubmitting || isLoading}
                className="w-full h-12 bg-yellow-500 hover:bg-yellow-600 text-white font-medium"
              >
                로그인
              </LoadingButton>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              계정이 없으신가요?{" "}
              <a
                href="#"
                className="text-yellow-600 hover:underline font-medium"
              >
                회원가입
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
