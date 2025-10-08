"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import "jspdf-autotable"
import { fetchAPI } from "@/lib/api"

const API_BASE_URL = "https://api.example.com" // Declare API_BASE_URL here

const GestaoFormacoes: React.FC = () => {
  const { toast } = useToast()
  const [loading, setLoading] = useState<boolean>(true)
  const [resumo, setResumo] = useState<any>({})
  const [evolucaoMensal, setEvolucaoMensal] = useState<any[]>([])
  const [distribuicaoTipo, setDistribuicaoTipo] = useState<any[]>([])
  const [topFormacoes, setTopFormacoes] = useState<any[]>([])
  const [investimentoMensal, setInvestimentoMensal] = useState<any[]>([])
  const [distribuicaoDepartamento, setDistribuicaoDepartamento] = useState<any[]>([])
  const [instrutores, setInstrutores] = useState<any[]>([])
  const [funcionarios, setFuncionarios] = useState<any[]>([])
  const [formacoes, setFormacoes] = useState<any[]>([])
  const [novaFormacao, setNovaFormacao] = useState<any>({
    titulo: "",
    descricao: "",
    categoria: "tecnica",
    tipo: "PRESENCIAL",
    instrutor_id: "",
    carga_horaria: 0,
    data_inicio: "",
    data_fim: "",
    horario: "09:00 - 18:00",
    vagas_totais: 0,
    obrigatoria: false,
    custo: 0,
    local: "",
    plataforma: "",
    nivel: "basico",
    certificado: true,
    nota_minima_aprovacao: 70,
  })
  const [novaInscricao, setNovaInscricao] = useState<any>({
    funcionario_id: "",
    formacao_id: "",
  })
  const [novoInstrutor, setNovoInstrutor] = useState<any>({
    nome: "",
    email: "",
  })
  const [novoPlano, setNovoPlano] = useState<any>({
    nome: "",
    descricao: "",
  })
  const [isCreatingFormacao, setIsCreatingFormacao] = useState<boolean>(false)
  const [isInscrevendo, setIsInscrevendo] = useState<boolean>(false)
  const [isCreatingInstrutor, setIsCreatingInstrutor] = useState<boolean>(false)
  const [isCreatingPlano, setIsCreatingPlano] = useState<boolean>(false)
  const [novaFormacaoOpen, setNovaFormacaoOpen] = useState<boolean>(false)
  const [inscreverFuncionarioOpen, setInscreverFuncionarioOpen] = useState<boolean>(false)
  const [novoInstrutorOpen, setNovoInstrutorOpen] = useState<boolean>(false)
  const [novoPlanoOpen, setNovoPlanoOpen] = useState<boolean>(false)

  const mapEvolucao = (data: any[]) => data // Define mapEvolucao here
  const mapDistribuicaoTipo = (data: any[]) => data // Define mapDistribuicaoTipo here
  const mapTopFormacoes = (data: any[]) => data // Define mapTopFormacoes here
  const mapInvestimento = (data: any[]) => data // Define mapInvestimento here
  const mapDistribuicaoDepartamento = (data: any[]) => data // Define mapDistribuicaoDepartamento here

  const safeParseInt = (value: any, defaultValue = 0) => {
    const parsedValue = Number.parseInt(value, 10)
    return isNaN(parsedValue) ? defaultValue : parsedValue
  }

  const safeParseFloat = (value: any, defaultValue = 0) => {
    const parsedValue = Number.parseFloat(value)
    return isNaN(parsedValue) ? defaultValue : parsedValue
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const endpoints = [
        { key: "resumo", url: `${API_BASE_URL}/formacoes/estatisticas/` },
        { key: "evolucao", url: `${API_BASE_URL}/formacoes/evolucao_mensal/` },
        { key: "distribuicaoTipo", url: `${API_BASE_URL}/formacoes/distribuicao_tipo/` },
        { key: "topFormacoes", url: `${API_BASE_URL}/relatorios/top_formacoes/` },
        { key: "investimento", url: `${API_BASE_URL}/relatorios/investimento_mensal/` },
        { key: "departamento", url: `${API_BASE_URL}/formacoes/distribuicao_departamento/` },
      ]

      const promises = endpoints.map((ep) => fetchAPI(ep.url).then((res) => ({ key: ep.key, res })))
      const results = await Promise.allSettled(promises)

      for (const p of results) {
        if (p.status === "fulfilled") {
          const { key, res } = p.value
          if (!res.ok) {
            toast({ title: `Erro (${key})`, description: `Falha ao buscar ${key}`, variant: "destructive" })
            continue
          }
          const data = await res.json()
          switch (key) {
            case "resumo":
              setResumo((prev:any) => ({ ...prev, ...data }))
              break
            case "evolucao":
              setEvolucaoMensal(mapEvolucao(Array.isArray(data) ? data : (data?.results ?? [])))
              break
            case "distribuicaoTipo":
              setDistribuicaoTipo(mapDistribuicaoTipo(Array.isArray(data) ? data : (data?.results ?? [])))
              break
            case "topFormacoes":
              setTopFormacoes(mapTopFormacoes(Array.isArray(data) ? data : (data?.results ?? [])))
              break
            case "investimento":
              setInvestimentoMensal(mapInvestimento(Array.isArray(data) ? data : (data?.results ?? [])))
              break
            case "departamento":
              setDistribuicaoDepartamento(
                mapDistribuicaoDepartamento(Array.isArray(data) ? data : (data?.results ?? [])),
              )
              break
            default:
              break
          }
        } else {
          toast({ title: "Erro de rede", description: "Falha ao buscar dados", variant: "destructive" })
        }
      }
    } catch (err) {
      console.error("Erro fetchData:", err)
      toast({ title: "Erro", description: "Erro ao carregar dados do sistema", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const fetchInstrutores = async () => {
    try {
      const res = await fetchAPI(`${API_BASE_URL}/instrutores/`)
      if (!res.ok) throw new Error("Erro ao buscar instrutores")
      const data = await res.json()
      setInstrutores(Array.isArray(data) ? data : (data?.results ?? []))
    } catch (err) {
      console.error(err)
    }
  }

  const fetchFuncionarios = async () => {
    try {
      const res = await fetchAPI(`${API_BASE_URL}/usuario/`)
      if (!res.ok) throw new Error("Erro ao buscar funcionários")
      const data = await res.json()
      setFuncionarios(Array.isArray(data) ? data : (data?.results ?? []))
    } catch (err) {
      console.error(err)
    }
  }

  const fetchFormacoes = async () => {
    try {
      const res = await fetchAPI(`${API_BASE_URL}/formacoes/`)
      if (!res.ok) throw new Error("Erro ao buscar formações")
      const data = await res.json()
      setFormacoes(Array.isArray(data) ? data : (data?.results ?? []))
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchData()
    fetchInstrutores()
    fetchFuncionarios()
    fetchFormacoes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---------- Actions (POSTs) ----------

  const handleCreateFormacao = async () => {
    setIsCreatingFormacao(true)
    try {
      const payload = {
        titulo: novaFormacao.titulo,
        descricao: novaFormacao.descricao,
        categoria: novaFormacao.categoria,
        tipo: novaFormacao.tipo,
        instrutor: novaFormacao.instrutor_id || null,
        carga_horaria: safeParseInt(novaFormacao.carga_horaria, 0),
        data_inicio: novaFormacao.data_inicio || null,
        data_fim: novaFormacao.data_fim || null,
        vagas: safeParseInt(novaFormacao.vagas_totais, 0),
        vagas_disponiveis: safeParseInt(novaFormacao.vagas_totais, 0),
        horario: novaFormacao.horario || "09:00 - 18:00",
        local: novaFormacao.local || "",
        link_online: novaFormacao.plataforma || "",
        custo: safeParseFloat(novaFormacao.custo, 0),
        status: "PLANEJADA",
        avaliacao_media: 0,
        total_avaliacoes: 0,
      }

      console.log("Payload enviado:", payload)

      const res = await fetchAPI(`${API_BASE_URL}/formacoes/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error("Erro detalhado:", errorText)
        throw new Error(errorText || "Erro ao criar formação")
      }

      toast({ title: "Sucesso", description: "Formação criada com sucesso!" })
      setNovaFormacaoOpen(false)

      setNovaFormacao({
        titulo: "",
        descricao: "",
        categoria: "tecnica",
        tipo: "PRESENCIAL",
        instrutor_id: "",
        carga_horaria: 0,
        data_inicio: "",
        data_fim: "",
        horario: "09:00 - 18:00",
        vagas_totais: 0,
        obrigatoria: false,
        custo: 0,
        local: "",
        plataforma: "",
        nivel: "basico",
        certificado: true,
        nota_minima_aprovacao: 70,
      })

      fetchData()
      fetchFormacoes()
    } catch (err) {
      console.error("Erro criar formação:", err)
      toast({
        title: "Erro",
        description: "Falha ao criar formação. Verifique os dados e tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsCreatingFormacao(false)
    }
  }

  const handleInscreverFuncionario = async () => {
    setIsInscrevendo(true)
    try {
      if (!novaInscricao.funcionario_id || !novaInscricao.formacao_id) {
        toast({ title: "Atenção", description: "Selecione funcionário e formação", variant: "destructive" })
        return
      }
      const res = await fetchAPI(`${API_BASE_URL}/inscricoes/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaInscricao),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Erro ao inscrever funcionário")
      }
      toast({ title: "Sucesso", description: "Funcionário inscrito com sucesso!" })
      setInscreverFuncionarioOpen(false)
      fetchData()
    } catch (err) {
      console.error("Erro inscrever:", err)
      toast({ title: "Erro", description: "Falha ao inscrever funcionário", variant: "destructive" })
    } finally {
      setIsInscrevendo(false)
    }
  }

  const handleCreateInstrutor = async () => {
    setIsCreatingInstrutor(true)
    try {
      const payload = { ...novoInstrutor }
      const res = await fetchAPI(`${API_BASE_URL}/instrutores/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Erro ao criar instrutor")
      }
      toast({ title: "Sucesso", description: "Instrutor criado com sucesso!" })
      setNovoInstrutorOpen(false)
      fetchInstrutores()
    } catch (err) {
      console.error("Erro criar instrutor:", err)
      toast({ title: "Erro", description: "Falha ao criar instrutor", variant: "destructive" })
    } finally {
      setIsCreatingInstrutor(false)
    }
  }

  const handleCreatePlano = async () => {
    setIsCreatingPlano(true)
    try {
      const payload = { ...novoPlano }
      const res = await fetchAPI(`${API_BASE_URL}/planos-desenvolvimento/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Erro ao criar plano")
      }
      toast({ title: "Sucesso", description: "Plano criado com sucesso!" })
      setNovoPlanoOpen(false)
    } catch (err) {
      console.error("Erro criar plano:", err)
      toast({ title: "Erro", description: "Falha ao criar plano", variant: "destructive" })
    } finally {
      setIsCreatingPlano(false)
    }
  }

  return <div>{/* Your component code here */}</div>
}

export default GestaoFormacoes
