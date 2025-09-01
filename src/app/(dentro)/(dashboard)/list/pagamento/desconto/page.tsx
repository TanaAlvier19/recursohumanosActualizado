'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

type DescontosImposto = {
  id?: string;
  desconto_inss: number;
  irt2: number;
  irt3: number;
  irt4: number;
  irt5: number;
  irt6: number;
  irt7: number;
};

// Defina um estado inicial vazio para evitar erros de 'undefined'
const initialDescontosState: DescontosImposto = {
  desconto_inss: 0,
  irt2: 0,
  irt3: 0,
  irt4: 0,
  irt5: 0,
  irt6: 0,
  irt7: 0,
};

export default function ConfiguracaoImpostos() {
  const { toast } = useToast();
  // Inicializa o estado com o objeto padrão, não com null
  const [descontos, setDescontos] = useState<DescontosImposto>(initialDescontosState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchDescontos();
  }, []);

  const fetchDescontos = async () => {
    try {
      const response = await fetch('http://localhost:8000/descontos-imposto/', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setDescontos(data);
      } else {
        throw new Error('Falha ao carregar descontos');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar as configurações de impostos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDescontos(prev => ({
      ...prev,
      [name]: parseFloat(value) / 100 
    }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const response = await fetch('http://localhost:8000/descontos-imposto/', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          desconto_inss: descontos.desconto_inss,
          irt2: descontos.irt2,
          irt3: descontos.irt3,
          irt4: descontos.irt4,
          irt5: descontos.irt5,
          irt6: descontos.irt6,
          irt7: descontos.irt7
        })
      });

      if (response.ok) {
        toast({
          title: "Sucesso!",
          description: "Configurações de impostos atualizadas com sucesso",
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || "Falha na atualização");
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar configurações",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-8 w-64" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
            <Skeleton className="h-10 w-40" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Configuração de Descontos de Impostos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="inss">INSS (%)</Label>
              <Input
                id="inss"
                name="desconto_inss"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={(descontos.desconto_inss * 100).toFixed(2)}
                onChange={handleChange}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Desconto padrão para previdência social
              </p>
            </div>
            
            <div>
              <Label htmlFor="irt2">IRT Faixa 2 (70.001 - 100.000) (%)</Label>
              <Input
                id="irt2"
                name="irt2"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={(descontos.irt2 * 100).toFixed(2)}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="irt3">IRT Faixa 3 (100.001 - 150.000) (%)</Label>
              <Input
                id="irt3"
                name="irt3"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={(descontos.irt3 * 100).toFixed(2)}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="irt4">IRT Faixa 4 (150.001 - 200.000) (%)</Label>
              <Input
                id="irt4"
                name="irt4"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={(descontos.irt4 * 100).toFixed(2)}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="irt5">IRT Faixa 5 (200.001 - 300.000) (%)</Label>
              <Input
                id="irt5"
                name="irt5"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={(descontos.irt5 * 100).toFixed(2)}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="irt6">IRT Faixa 6 (300.001 - 500.000) (%)</Label>
              <Input
                id="irt6"
                name="irt6"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={(descontos.irt6 * 100).toFixed(2)}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="irt7">IRT Faixa 7 (Acima de 500.000) (%)</Label>
              <Input
                id="irt7"
                name="irt7"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={(descontos.irt7 * 100).toFixed(2)}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}