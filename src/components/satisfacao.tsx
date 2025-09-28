'use client';
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Send, X, MessageCircle, Heart, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Swal from "sweetalert2";

interface FeedbackData {
  pontuacao: number;
  comentario: string; 
}

const FeedbackSatisfacao = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [empresaId, setEmpresaId] = useState<number | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const feedbackShown = localStorage.getItem('feedbackShown');
    const firstVisit = localStorage.getItem('firstVisitTime');
    
    if (!firstVisit) {
      localStorage.setItem('firstVisitTime', Date.now().toString());
    } else {
      const visitTime = parseInt(firstVisit);
      const currentTime = Date.now();
      const timeOnSite = currentTime - visitTime;
      
      if (!feedbackShown && timeOnSite > 30000) {
        const timer = setTimeout(() => {
          setIsOpen(true);
          localStorage.setItem('feedbackShown', 'true');
        }, 2000); // Pequeno delay para não ser intrusivo
        
        return () => clearTimeout(timer);
      }
    }
  }, []);

  useEffect(() => {
    const handleUserInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        const feedbackShown = localStorage.getItem('feedbackShown');
        
        if (!feedbackShown) {
          const timer = setTimeout(() => {
            setIsOpen(true);
            localStorage.setItem('feedbackShown', 'true');
          }, 1000);
          
          return () => clearTimeout(timer);
        }
      }
    };

    // Eventos que indicam interação do usuário
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('scroll', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('scroll', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, [hasInteracted]);

  const handleSubmit = async () => {
    if (!rating) {
      toast({
        title: "Avaliação necessária",
        description: "Por favor, selecione uma pontuação antes de enviar.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const feedbackData: FeedbackData = {
        pontuacao: rating,
        comentario: comment
      };

      const response = await fetch("http://localhost:8000/satisfacao/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      });

      if (response.ok) {
        Swal.fire({
          title: "🎉 Obrigado!",
          text: "Seu feedback nos ajuda a melhorar cada vez mais.",
          icon: "success",
          confirmButtonText: "Continuar Navegando",
          confirmButtonColor: "#3B82F6",
          customClass: {
            popup: 'rounded-2xl shadow-xl',
            confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg'
          }
        });
        
        setRating(0);
        setComment("");
        setIsOpen(false);
        
        // Marcar como enviado para não mostrar novamente
        localStorage.setItem('feedbackSubmitted', 'true');
      } else {
        throw new Error("Falha ao enviar feedback");
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar seu feedback. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const RatingStars = () => {
    return (
      <div className="flex gap-3 justify-center mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="transform transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
          >
            <Star
              className={`w-12 h-12 transition-all duration-300 ${
                star <= (hoverRating || rating)
                  ? "fill-yellow-400 text-yellow-400 drop-shadow-lg"
                  : "text-gray-300 hover:text-yellow-200"
              }`}
            />
          </motion.button>
        ))}
      </div>
    );
  };

  const getRatingText = () => {
    const texts = {
      1: "Precisamos melhorar 😔",
      2: "Podemos melhorar 🙁",
      3: "Está bom 🙂",
      4: "Muito bom! 😊",
      5: "Excelente! 🎉"
    };
    return texts[rating as keyof typeof texts] || "Como está sua experiência?";
  };

  const getRatingEmoji = () => {
    const emojis = {
      1: "😔",
      2: "🙁", 
      3: "🙂",
      4: "😊",
      5: "🎉"
    };
    return emojis[rating as keyof typeof emojis] || "⭐";
  };

  // Não renderizar se o usuário já enviou feedback
  if (localStorage.getItem('feedbackSubmitted') === 'true') {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-md"
          >
            <Card className="relative border-0 shadow-2xl bg-gradient-to-br from-white to-blue-50/30">
              {/* Decoração */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full animate-ping"></div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full"></div>
              
              <CardHeader className="text-center pb-4 relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="absolute right-2 top-2 h-8 w-8 rounded-full hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </Button>
                
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                >
                  <Sparkles className="w-10 h-10 text-white" />
                </motion.div>
                
                <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  O que você achou?
                </CardTitle>
                <CardDescription className="text-lg">
                  Sua opinião é muito valiosa para nós!
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="text-center">
                  <RatingStars />
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xl font-semibold text-gray-800 mt-2"
                  >
                    <span className="mr-2 text-2xl">{getRatingEmoji()}</span>
                    {getRatingText()}
                  </motion.p>
                </div>

                {/* Comentário - Aparece apenas após avaliação */}
                <AnimatePresence>
                  {rating > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3 overflow-hidden"
                    >
                      <Label htmlFor="comment" className="text-sm font-medium">
                        {rating >= 4 ? "O que mais você gostou? 😊" : 
                         rating <= 2 ? "Como podemos melhorar? 🤔" : 
                         "Tem alguma sugestão? 💡"}
                      </Label>
                      <Textarea
                        id="comment"
                        placeholder={
                          rating >= 4 ? "Compartilhe o que mais te impressionou..." :
                          rating <= 2 ? "Nos conte o que podemos fazer melhor..." :
                          "Sua sugestão é muito importante para nós..."
                        }
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-[100px] resize-none border-2 focus:border-blue-500 transition-colors"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Botões de Ação */}
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsOpen(false);
                      localStorage.setItem('feedbackShown', 'true');
                    }}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    Agora não
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !rating}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Enviando...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        Enviar Avaliação
                      </div>
                    )}
                  </Button>
                </div>

                {/* Informação de Privacidade */}
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-xs text-gray-500 text-center"
                >
                  💡 Seu feedback é anônimo e nos ajuda a criar uma experiência melhor
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackSatisfacao;