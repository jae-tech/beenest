import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { Form, FormField } from "@/shared/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { loginSchema, type LoginFormData } from "../schemas/loginSchema";
import LogoSvg from "/logo.svg";

export function LoginForm() {
  const { login, isLoading, error, clearError } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@beenest.com",
      password: "password",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    login(data);
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
          <Form form={form} onSubmit={onSubmit} className="space-y-6">
            <FormField
              name="email"
              label="이메일 주소"
              type="email"
              placeholder="이메일을 입력하세요"
            />

            <FormField
              name="password"
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력하세요"
            />

            <div className="flex items-center justify-between">
              <Controller
                name="rememberMe"
                control={form.control}
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

            <Button
              type="submit"
              disabled={form.formState.isSubmitting || isLoading}
              className="w-full h-12 bg-yellow-500 hover:bg-yellow-600 text-white font-medium"
            >
              {form.formState.isSubmitting || isLoading
                ? "로그인 중..."
                : "로그인"}
            </Button>
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
