// app/not-found.tsx
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Página não encontrada | 404 - Onono</title>
        <meta name="description" content="Ops! A página que você procura não foi encontrada." />
      </Head>

      {/* Fundo com gradiente animado */}
      <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* Bolhas decorativas animadas */}
        <div className="absolute top-10 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/4 right-20 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

        {/* Conteúdo principal */}
        <div className="relative z-10 max-w-4xl w-full text-center space-y-10 py-12 px-6">
          {/* Logo moderno */}
          <div className="mb-8">
            <Link href="/" className="inline-block hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl w-24 h-24 mx-auto shadow-lg flex items-center justify-center">
                <span className="text-white text-4xl font-bold">O</span>
              </div>
            </Link>
          </div>

          {/* Ilustração geométrica moderna */}
          <div className="relative mx-auto w-80 h-80">
            <div className="absolute inset-0">
              {/* Formas geométricas */}
              <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full opacity-70 animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full opacity-70 animate-pulse animation-delay-1000"></div>
              
              {/* Símbolo 404 central com gradiente */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 z-10 animate-float">
                404
              </div>
              
              {/* Elementos decorativos */}
              <div className="absolute top-1/4 right-1/4 w-16 h-16 border-4 border-indigo-400 rounded-full animate-bounce"></div>
              <div className="absolute bottom-1/4 left-1/4 w-12 h-12 border-4 border-purple-400 rounded-full animate-bounce animation-delay-1000"></div>
            </div>
          </div>

          {/* Conteúdo de texto */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
              Página <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">não encontrada</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Parece que você encontrou um lugar onde a criatividade ainda não chegou. Vamos redirecionar seu caminho.
            </p>
          </div>

          {/* Botões com efeitos modernos */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center pt-6">
            <Link
              href="/"
              className="relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              <span className="relative z-10">Voltar à página inicial</span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -inset-1 bg-white rounded-xl blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            </Link>
            
            <Link
              href="/contato"
              className="relative px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-600 font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              <span className="relative z-10">Reportar problema</span>
              <div className="absolute inset-0 bg-indigo-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>

          {/* Rodapé minimalista */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <p className="text-gray-500">
              © {new Date().getFullYear()} Onono. Todos os direitos reservados.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Inovação em cada pixel
            </p>
          </div>
        </div>
      </div>

      {/* Estilos de animação inline */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(-50%); }
          50% { transform: translateY(-20px) translateX(-50%); }
        }
        @keyframes blob {
          0%, 100% { transform: translate(0,0) scale(1); }
          25% { transform: translate(20px,-50px) scale(1.1); }
          50% { transform: translate(0,-20px) scale(1); }
          75% { transform: translate(-20px,-15px) scale(0.9); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.05); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-pulse {
          animation: pulse 4s infinite;
        }
        .animate-bounce {
          animation: bounce 3s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </>
  );
}