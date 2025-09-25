import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRegister } from "../hooks/useAuth";

const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "이메일을 입력해주세요")
      .email("올바른 이메일 형식을 입력해주세요"),
    password: z
      .string()
      .min(6, "비밀번호는 최소 6자 이상이어야 합니다")
      .max(50, "비밀번호는 최대 50자까지 입력 가능합니다"),
    confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요"),
    name: z
      .string()
      .min(2, "이름은 최소 2자 이상이어야 합니다")
      .max(20, "이름은 최대 20자까지 입력 가능합니다"),
    companyName: z
      .string()
      .min(2, "회사명은 최소 2자 이상이어야 합니다")
      .max(50, "회사명은 최대 50자까지 입력 가능합니다")
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterPageProps {
  onRegisterSuccess?: () => void;
  className?: string;
}

export const RegisterPage = ({
  onRegisterSuccess,
  className = "",
}: RegisterPageProps) => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading, error } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      companyName: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        name: data.name,
        companyName: data.companyName || undefined,
      });
      onRegisterSuccess?.();
      navigate({ to: "/login" });
    } catch (err) {
      setError("root", {
        message: "회원가입에 실패했습니다. 다시 시도해주세요.",
      });
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center p-4 ${className}`}
    >
      <div className="w-full max-w-md">
        <div className="p-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm rounded-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-2xl mb-4">
              <i className="fas fa-cube text-2xl text-white"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Beenest</h1>
            <p className="text-gray-600">새 계정 만들기</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                이름 *
              </label>
              <input
                {...register("name")}
                type="text"
                placeholder="이름을 입력하세요"
                className={`h-12 w-full px-3 py-2 border border-gray-100 rounded-md focus:border-yellow-400 focus:ring-yellow-400 text-sm ${
                  errors.name ? "border-red-300" : ""
                }`}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                회사명
              </label>
              <input
                {...register("companyName")}
                type="text"
                placeholder="회사명을 입력하세요 (선택)"
                className={`h-12 w-full px-3 py-2 border border-gray-100 rounded-md focus:border-yellow-400 focus:ring-yellow-400 text-sm ${
                  errors.companyName ? "border-red-300" : ""
                }`}
              />
              {errors.companyName && (
                <p className="text-sm text-red-600">
                  {errors.companyName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                이메일 주소 *
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="이메일을 입력하세요"
                className={`h-12 w-full px-3 py-2 border border-gray-100 rounded-md focus:border-yellow-400 focus:ring-yellow-400 text-sm ${
                  errors.email ? "border-red-300" : ""
                }`}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                비밀번호 *
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호를 입력하세요"
                  className={`h-12 w-full px-3 py-2 border border-gray-100 rounded-md focus:border-yellow-400 focus:ring-yellow-400 text-sm ${
                    errors.password ? "border-red-300" : ""
                  }`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="h-5 w-5 text-gray-400">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </span>
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                비밀번호 확인 *
              </label>
              <div className="relative">
                <input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="비밀번호를 다시 입력하세요"
                  className={`h-12 w-full px-3 py-2 border border-gray-100 rounded-md focus:border-yellow-400 focus:ring-yellow-400 text-sm ${
                    errors.confirmPassword ? "border-red-300" : ""
                  }`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <span className="h-5 w-5 text-gray-400">
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </span>
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {(error || errors.root) && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-800">
                  {error || errors.root?.message}
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full h-12 font-semibold whitespace-nowrap cursor-pointer"
            >
              {isSubmitting || isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  가입 중...
                </span>
              ) : (
                "계정 만들기"
              )}
            </Button>

            <div className="text-center text-sm text-gray-600">
              이미 계정이 있으신가요?
              <Link
                to="/login"
                className="text-yellow-600 hover:text-yellow-700 font-medium ml-1 cursor-pointer"
              >
                로그인하기
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
