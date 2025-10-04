"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Settings, Mail, Workflow, Bell, Plus, Edit, Trash2, Save, LinkIcon, Check } from "lucide-react"

export default function ConfiguracoesRecrutamento() {
  const [etapas, setEtapas] = useState([
    { id: 1, nome: "Triagem", ordem: 1, obrigatoria: true, ativa: true },
    { id: 2, nome: "Entrevista RH", ordem: 2, obrigatoria: true, ativa: true },
    { id: 3, nome: "Teste Técnico", ordem: 3, obrigatoria: false, ativa: true },
    { id: 4, nome: "Entrevista Técnica", ordem: 4, obrigatoria: true, ativa: true },
    { id: 5, nome: "Proposta", ordem: 5, obrigatoria: true, ativa: true },
  ])

  const [templates, setTemplates] = useState([
    { id: 1, nome: "Confirmação de Candidatura", tipo: "candidato", ativo: true },
    { id: 2, nome: "Convite para Entrevista", tipo: "candidato", ativo: true },
    { id: 3, nome: "Envio de Teste Técnico", tipo: "candidato", ativo: true },
    { id: 4, nome: "Feedback Positivo", tipo: "candidato", ativo: true },
    { id: 5, nome: "Feedback Negativo", tipo: "candidato", ativo: true },
    { id: 6, nome: "Proposta de Emprego", tipo: "candidato", ativo: true },
  ])

  const [integracoes, setIntegracoes] = useState([
    { id: 1, nome: "LinkedIn", tipo: "Rede Social", conectado: true, icone: "🔗" },
    { id: 2, nome: "Indeed", tipo: "Portal de Vagas", conectado: true, icone: "🔗" },
    { id: 3, nome: "Google Calendar", tipo: "Calendário", conectado: true, icone: "📅" },
    { id: 4, nome: "Zoom", tipo: "Videoconferência", conectado: true, icone: "🎥" },
    { id: 5, nome: "Slack", tipo: "Comunicação", conectado: false, icone: "💬" },
    { id: 6, nome: "Microsoft Teams", tipo: "Videoconferência", conectado: false, icone: "🎥" },
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Configurações
            </h1>
            <p className="text-slate-400 mt-1">Personalize o processo de recrutamento</p>
          </div>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>

        {/* Tabs de Configurações */}
        <Tabs defaultValue="etapas" className="space-y-4">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="etapas">
              <Workflow className="w-4 h-4 mr-2" />
              Etapas
            </TabsTrigger>
            <TabsTrigger value="templates">
              <Mail className="w-4 h-4 mr-2" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="integracoes">
              <LinkIcon className="w-4 h-4 mr-2" />
              Integrações
            </TabsTrigger>
            <TabsTrigger value="notificacoes">
              <Bell className="w-4 h-4 mr-2" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="geral">
              <Settings className="w-4 h-4 mr-2" />
              Geral
            </TabsTrigger>
          </TabsList>

          {/* Etapas do Processo */}
          <TabsContent value="etapas" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Etapas do Processo</CardTitle>
                    <CardDescription>Configure as etapas do funil de recrutamento</CardDescription>
                  </div>
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Etapa
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {etapas.map((etapa) => (
                    <div
                      key={etapa.id}
                      className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-lg">
                          <span className="text-cyan-400 font-bold">{etapa.ordem}</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{etapa.nome}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {etapa.obrigatoria && (
                              <Badge variant="outline" className="border-red-500/50 text-red-400 text-xs">
                                Obrigatória
                              </Badge>
                            )}
                            <Badge
                              variant="outline"
                              className={
                                etapa.ativa
                                  ? "border-green-500/50 text-green-400 text-xs"
                                  : "border-slate-600 text-slate-400 text-xs"
                              }
                            >
                              {etapa.ativa ? "Ativa" : "Inativa"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={etapa.ativa} />
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-cyan-400">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates de Email */}
          <TabsContent value="templates" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Templates de Email</CardTitle>
                    <CardDescription>Personalize as mensagens automáticas</CardDescription>
                  </div>
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Template
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-lg">
                          <Mail className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{template.nome}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                              {template.tipo}
                            </Badge>
                            {template.ativo && (
                              <Badge variant="outline" className="border-green-500/50 text-green-400 text-xs">
                                Ativo
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={template.ativo} />
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-cyan-400">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Editor de Template</CardTitle>
                <CardDescription>Edite o template selecionado</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-slate-300">Assunto</Label>
                  <Input
                    placeholder="Ex: Confirmação de Candidatura"
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Corpo do Email</Label>
                  <Textarea
                    placeholder="Digite o conteúdo do email..."
                    rows={10}
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                  <p className="text-slate-500 text-sm mt-2">
                    Variáveis disponíveis: {"{nome_candidato}"}, {"{nome_vaga}"}, {"{empresa}"}, {"{data}"}, {"{hora}"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrações */}
          <TabsContent value="integracoes" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Integrações Disponíveis</CardTitle>
                <CardDescription>Conecte ferramentas externas ao sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {integracoes.map((integracao) => (
                    <div key={integracao.id} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{integracao.icone}</div>
                          <div>
                            <p className="text-white font-medium">{integracao.nome}</p>
                            <p className="text-slate-400 text-sm">{integracao.tipo}</p>
                          </div>
                        </div>
                        {integracao.conectado ? (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                            <Check className="w-3 h-3 mr-1" />
                            Conectado
                          </Badge>
                        ) : (
                          <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-600">
                            Conectar
                          </Button>
                        )}
                      </div>
                      {integracao.conectado && (
                        <div className="mt-4 pt-4 border-t border-slate-700">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-slate-600 text-slate-300 bg-transparent"
                          >
                            Configurar
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notificações */}
          <TabsContent value="notificacoes" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Preferências de Notificação</CardTitle>
                <CardDescription>Configure quando e como receber notificações</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { titulo: "Nova Candidatura", descricao: "Notificar quando um candidato se candidatar" },
                  { titulo: "Entrevista Agendada", descricao: "Lembrete de entrevistas próximas" },
                  { titulo: "Teste Concluído", descricao: "Quando um candidato finalizar um teste" },
                  { titulo: "Feedback Pendente", descricao: "Lembrete de avaliações pendentes" },
                  { titulo: "Vaga Expirada", descricao: "Quando uma vaga atingir a data limite" },
                ].map((notif, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{notif.titulo}</p>
                      <p className="text-slate-400 text-sm">{notif.descricao}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configurações Gerais */}
          <TabsContent value="geral" className="space-y-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Configurações Gerais</CardTitle>
                <CardDescription>Ajustes globais do sistema de recrutamento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-300">Nome da Empresa</Label>
                    <Input placeholder="Ex: Tech Solutions" className="bg-slate-900 border-slate-700 text-white" />
                  </div>
                  <div>
                    <Label className="text-slate-300">Email de Contato</Label>
                    <Input
                      type="email"
                      placeholder="recrutamento@empresa.com"
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-300">URL da Página de Carreiras</Label>
                    <Input
                      placeholder="https://empresa.com/carreiras"
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-700 space-y-4">
                  <h3 className="text-white font-medium">Preferências do Sistema</h3>
                  {[
                    {
                      titulo: "Aprovar candidaturas automaticamente",
                      descricao: "Candidatos passam direto para triagem",
                    },
                    {
                      titulo: "Permitir candidaturas anônimas",
                      descricao: "Candidatos podem se candidatar sem criar conta",
                    },
                    { titulo: "Exigir carta de apresentação", descricao: "Tornar obrigatório o envio de carta" },
                    { titulo: "Habilitar banco de talentos", descricao: "Salvar candidatos para futuras vagas" },
                  ].map((pref, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{pref.titulo}</p>
                        <p className="text-slate-400 text-sm">{pref.descricao}</p>
                      </div>
                      <Switch />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
