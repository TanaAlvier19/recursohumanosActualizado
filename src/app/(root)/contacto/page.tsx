import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
export default function Page() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-24 px-4'>
      <div className='max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center'>
        
        <div className='space-y-6'>
          <h1 className='text-5xl font-bold text-white leading-tight'>
            Entre em Contato Conosco
          </h1>
          <p className='text-lg text-gray-300'>
            Tem alguma dúvida ou sugestão? Adoraríamos ouvir você. 
            Preencha o formulário ao lado e retornaremos em breve.
          </p>
        </div>

        <div className='bg-white rounded-2xl shadow-xl p-8 space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='email' className='text-sm font-medium text-gray-700'>
              Endereço de Email
            </Label>
            <Input
              id='email'
              placeholder='seu@email.com'
              type='email'
              className='border-2 border-gray-200 focus:border-blue-500 transition-colors p-3 rounded-lg'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='message' className='text-sm font-medium text-gray-700'>
              Sua Mensagem
            </Label>
            <textarea
              id='message'
              placeholder='Conte-nos o que tem em mente...'
              className='w-full h-32 border-2 border-gray-200 focus:border-blue-500 transition-colors p-3 rounded-lg resize-none'
            />
          </div>

          <Button className='w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium'>
            Enviar Mensagem
          </Button>
        </div>
      </div>
    </div>
  )
}