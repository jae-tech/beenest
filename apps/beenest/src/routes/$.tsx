import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Home } from "lucide-react";

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-warning/10 to-warning/20 flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md mx-auto">
        <div className="relative w-48 h-48 mx-auto">
          <img
            src={"/404.svg"}
            alt="Lost Bee"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-3">
          <h1 className="text-6xl font-bold text-foreground">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">
            이 페이지는 재고가 부족해요!
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            죄송합니다, 찾으시는 페이지의 재고가 모두 소진되었어요.
            <br />
            꿀벌들이 열심히 재고를 채우고 있으니, 잠시 후에 다시 방문해주세요.
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 space-y-2">
          <p className="text-sm text-muted-foreground italic">
            "꿀이 부족한 벌집은 없죠! 다음 페이지는 꼭 재고가 넉넉할 거예요!"
          </p>
        </div>

        <div className="space-y-3">
          <Link to="/dashboard">
            <Button variant="warning" className="font-semibold px-6 py-3 rounded-lg whitespace-nowrap shadow-lg hover:shadow-xl transition-all">
              <Home className="w-4 h-4 mr-2" />
              벌집으로 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/$")({
  component: NotFoundPage,
});
