import { Category } from '@/types/syncBot';

export const botCategories: Category[] = [
  {
    id: 'setup',
    name: 'setup',
    description: 'setup',
    icon: '🏠',
    topics: [
      {
        id: 'first_login',
        name: 'first_login',
        content: `**Como fazer login pela primeira vez:**

1. **Acesse a página de login** do CLICK SYNC
2. **Digite seu email** cadastrado no sistema
3. **Digite sua senha** fornecida pelo administrador
4. **Clique em "Entrar no Sistema"**

🔐 **Primeira vez?** Suas credenciais são enviadas por email pelo administrador.

⚠️ **Problemas de acesso?** Entre em contato com o suporte.`,
        relatedTopics: ['profile_config', 'first_dashboard']
      },
      {
        id: 'profile_config',
        name: 'profile_config',
        content: `**Configuração do perfil e preferências:**

1. **Clique no ícone do usuário** no canto superior direito
2. **Selecione "Configurações"** no menu
3. **Configure:**
   - Idioma (Português/English)
   - Tema (Claro/Escuro)
   - Timezone
   - Moeda padrão
   - Notificações

💡 **Dica:** Suas preferências são salvas automaticamente.`,
        relatedTopics: ['first_login', 'timezone_currency']
      },
      {
        id: 'google_ads_integration',
        name: 'google_ads_integration',
        content: `**Integração com Google Ads (passo-a-passo):**

1. **Acesse** "Conectar Google Ads" no menu lateral
2. **Clique em "Criar Primeiro Webhook"**
3. **Preencha os dados:**
   - Nome do webhook
   - ID da conta (opcional)
   - Moeda da conta
4. **Copie a URL** do webhook gerada
5. **No Google Ads:**
   - Ferramentas → Scripts
   - Novo Script
   - Cole o código fornecido
   - Configure a URL do webhook
6. **Agende execução diária**

✅ **Pronto!** Seus dados serão sincronizados automaticamente.`,
        relatedTopics: ['webhooks', 'custom_scripts']
      },
      {
        id: 'timezone_currency',
        name: 'timezone_currency',
        content: `**Configuração de timezone e moeda:**

**Timezone:**
- Sistema usa **horário de Brasília** por padrão
- Visível no header superior
- Todos os relatórios seguem este horário

**Moeda:**
- **BRL (Real)** e **USD (Dólar)** suportados
- Conversão automática usando cotação em tempo real
- Configurável por campanha

🌍 **Global:** Sistema suporta operações internacionais.`,
        relatedTopics: ['profile_config', 'currency_conversion']
      },
      {
        id: 'first_dashboard',
        name: 'first_dashboard',
        content: `**Primeiro acesso ao dashboard:**

**Layout principal:**
- **Sidebar:** Navegação entre seções
- **Header:** Informações em tempo real
- **Dashboard:** Métricas principais
- **Gráficos:** Performance visual

**Primeiros passos:**
1. Explore as seções no menu lateral
2. Configure suas campanhas
3. Conecte Google Ads
4. Personalize métricas

🎯 **Objetivo:** Ter visão completa das campanhas em poucos cliques.`,
        relatedTopics: ['customize_dashboard', 'google_ads_integration']
      }
    ]
  },
  {
    id: 'dashboard',
    name: 'dashboard',
    description: 'dashboard',
    icon: '📊',
    topics: [
      {
        id: 'customize_dashboard',
        name: 'customize_dashboard',
        content: `**Como personalizar o dashboard:**

**Drag & Drop:**
- Arraste gráficos para reorganizar
- Redimensione componentes
- Layout salvo automaticamente

**Filtros:**
- Período de tempo
- Campanhas específicas
- Métricas visíveis

**Personalização:**
1. Use o ícone de configuração
2. Selecione métricas desejadas
3. Defina ordem de exibição
4. Aplique filtros avançados

✨ **Resultado:** Dashboard sob medida para suas necessidades.`,
        relatedTopics: ['advanced_filters', 'export_reports']
      },
      {
        id: 'understand_metrics',
        name: 'understand_metrics',
        content: `**Entendendo as métricas principais:**

**Performance:**
- **CTR:** Taxa de cliques (cliques/impressões)
- **CPC:** Custo por clique
- **CPA:** Custo por aquisição

**Financeiro:**
- **ROI:** Retorno sobre investimento
- **ROAS:** Retorno sobre gasto publicitário
- **Lucro:** Receita - Custo

**Engagement:**
- **Impressões:** Visualizações do anúncio
- **Cliques:** Interações com anúncios
- **Conversões:** Ações desejadas

💡 **Dica:** Passe o mouse sobre métricas para detalhes.`,
        relatedTopics: ['detailed_metrics', 'conversion_funnel']
      },
      {
        id: 'smart_alerts',
        name: 'smart_alerts',
        content: `**Configurando alertas inteligentes:**

**Tipos de alertas:**
- Campanhas com baixo ROAS
- Orçamento esgotando
- Performance anormal
- Oportunidades de otimização

**Configuração:**
1. Vá em Dashboard → Configurar Alertas
2. Defina thresholds para métricas
3. Escolha canais (email/push)
4. Configure frequência

**Alertas disponíveis:**
- 🚨 Urgente (ROAS < 1.0)
- ⚠️ Atenção (Performance baixa)
- 💡 Oportunidade (Otimizações)

🎯 **Benefício:** Ação proativa antes de problemas.`,
        relatedTopics: ['proactive_alerts', 'ai_recommendations']
      },
      {
        id: 'advanced_filters',
        name: 'advanced_filters',
        content: `**Usando filtros avançados:**

**Filtros de período:**
- Últimos 7/30/90 dias
- Período customizado
- Comparação com período anterior

**Filtros de campanha:**
- Status (ativas/pausadas)
- Estratégia de lances
- Performance (alto/baixo ROAS)

**Filtros de métricas:**
- Investimento mínimo/máximo
- ROI range
- Conversões threshold

**Combinações:**
- Multiple filtros simultâneos
- Salvar como preset
- Aplicar em relatórios

🔍 **Poder:** Análise granular dos dados.`,
        relatedTopics: ['customize_dashboard', 'export_reports']
      },
      {
        id: 'export_reports',
        name: 'export_reports',
        content: `**Exportando relatórios (PDF/CSV):**

**Formatos disponíveis:**
- **PDF:** Relatórios visuais completos
- **CSV:** Dados para análise externa
- **Excel:** Planilhas estruturadas

**Tipos de relatório:**
- Dashboard geral
- Performance de campanhas
- Análise financeira
- Funil de conversão

**Como exportar:**
1. Configure filtros desejados
2. Clique em "Exportar"
3. Escolha formato
4. Download automático

📊 **Usos:** Apresentações, análises externas, backup.`,
        relatedTopics: ['advanced_filters', 'customize_dashboard']
      }
    ]
  },
  {
    id: 'financial',
    name: 'financial',
    description: 'financial',
    icon: '💰',
    topics: [
      {
        id: 'add_accounts',
        name: 'add_accounts',
        content: `**Adicionando contas Google Ads:**

**No módulo Financeiro:**
1. Acesse "Gestão de Contas Google Ads"
2. Clique em "Adicionar Conta"
3. **Preencha:**
   - Nome da conta
   - Email
   - Status inicial
   - Saldo (se houver)

**Status possíveis:**
- ✅ Ativa
- ⏸️ Pausada
- ⛔ Suspensa
- 💸 Devedor

**Gestão:**
- Acompanhe saldo
- Monitore faturas pendentes
- Histórico de atividades

💼 **Benefício:** Controle financeiro centralizado.`,
        relatedTopics: ['commission_structure', 'cash_flow']
      },
      {
        id: 'commission_structure',
        name: 'commission_structure',
        content: `**Configurando estrutura de comissões:**

**Modelos suportados:**
- Porcentagem fixa por conversão
- Valor fixo (USD) por conversão
- Comissão escalonada por volume
- Modelo híbrido

**Configuração:**
1. Acesse configurações de campanha
2. Defina modelo de comissão
3. Configure valores/percentuais
4. Aplique a campanhas específicas

**Cálculo automático:**
- Comissão aparece nas métricas
- Relatórios financeiros incluem
- Dashboard mostra totais

💰 **Resultado:** Lucro real calculado automaticamente.`,
        relatedTopics: ['add_accounts', 'cash_flow']
      },
      {
        id: 'cash_flow',
        name: 'cash_flow',
        content: `**Monitorando fluxo de caixa:**

**Visão 360°:**
- Valores a receber
- Custos com campanhas
- Saldo de contas
- Projeções futuras

**Cenários de projeção:**
- 📈 Otimista (+20%)
- 📊 Realista (atual)
- 📉 Conservador (-15%)
- 🔻 Pessimista (-30%)

**Indicadores:**
- Saldo atual
- Contas pendentes
- Próximos pagamentos
- Tendências

💡 **Análise:** Baseada em histórico e variações estatísticas.`,
        relatedTopics: ['payment_schedule', 'add_accounts']
      },
      {
        id: 'payment_schedule',
        name: 'payment_schedule',
        content: `**Agendamento de pagamentos:**

**Cronograma inteligente:**
- Hoje
- Próximos 7 dias
- Este mês
- Customizado

**Cadastro de pagamento:**
1. Clique em "Adicionar Pagamento"
2. **Defina:**
   - Plataforma
   - Valor esperado
   - Data de pagamento
   - Período de referência
   - Observações
3. Configure notificações

**Status tracking:**
- 📅 Programado
- ✅ Recebido
- ⏰ Atrasado

🔔 **Lembrete:** Notificações no dia do pagamento.`,
        relatedTopics: ['cash_flow', 'currency_conversion']
      },
      {
        id: 'currency_conversion',
        name: 'currency_conversion',
        content: `**Conversão de moedas (BRL/USD):**

**Sistema automático:**
- Cotação em tempo real
- Atualização contínua
- Histórico de variações

**Como funciona:**
1. Sistema busca cotação atual
2. Aplica em todas as métricas
3. Exibe equivalências
4. Relatórios em ambas moedas

**Visibilidade:**
- Header mostra USD/BRL atual
- Campanhas USD mostram BRL equivalente
- Relatórios com ambas moedas

**Manual override:**
- Possível definir cotação fixa
- Útil para contratos específicos

💱 **Precisão:** Dados financeiros sempre atualizados.`,
        relatedTopics: ['add_accounts', 'payment_schedule']
      }
    ]
  },
  {
    id: 'insights',
    name: 'insights',
    description: 'insights',
    icon: '🔮',
    topics: [
      {
        id: 'forecasting',
        name: 'forecasting',
        content: `**Como funciona o forecasting:**

**IA Avançada:**
- Análise de padrões históricos
- Machine Learning aplicado
- Previsões baseadas em tendências
- Consideração de sazonalidade

**Tipos de previsão:**
- Performance futura (ROI, ROAS)
- Volume de conversões
- Custos projetados
- Receita esperada

**Horizontes:**
- 7 dias (alta precisão)
- 30 dias (boa precisão)
- 90 dias (tendências)

**Confiabilidade:**
- Percentual de confiança
- Margem de erro
- Cenários múltiplos

🔮 **Resultado:** Decisões baseadas em dados preditivos.`,
        relatedTopics: ['forecast_scenarios', 'predictive_analysis']
      },
      {
        id: 'ai_recommendations',
        name: 'ai_recommendations',
        content: `**Interpretando recomendações da IA:**

**Tipos de insight:**
- 🟢 **Oportunidade:** Ações para crescer
- 🟡 **Atenção:** Monitoramento necessário
- 🔴 **Crítico:** Ação imediata
- 🔵 **Previsão:** Tendências futuras

**Exemplos comuns:**
- "Aumente orçamento da Campanha X (+30% ROI)"
- "Pausar Campanha Y (ROAS < 1.0)"
- "Otimizar horários - pico às 14h"

**Como agir:**
1. Leia o insight completo
2. Verifique o nível de confiança
3. Analise dados de suporte
4. Implemente gradualmente

🎯 **Meta:** Maximizar performance com mínimo esforço.`,
        relatedTopics: ['forecasting', 'proactive_alerts']
      },
      {
        id: 'forecast_scenarios',
        name: 'forecast_scenarios',
        content: `**Configurando cenários de previsão:**

**Cenários padrão:**
- **Otimista:** Crescimento acima da média
- **Realista:** Tendência atual mantida
- **Conservador:** Performance reduzida
- **Pessimista:** Cenário adverso

**Personalização:**
1. Acesse módulo Insights
2. Configure parâmetros:
   - Período de análise
   - Métricas focadas
   - Variações esperadas
3. Salve como preset

**Variáveis consideradas:**
- Sazonalidade
- Histórico de performance
- Tendências de mercado
- Mudanças recentes

📊 **Uso:** Planejamento estratégico e orçamentário.`,
        relatedTopics: ['forecasting', 'ai_recommendations']
      },
      {
        id: 'proactive_alerts',
        name: 'proactive_alerts',
        content: `**Alertas proativos e notificações:**

**Inteligência preventiva:**
- Detecta problemas antes que aconteçam
- Identifica oportunidades emergentes
- Monitora mudanças de padrão
- Sugere ações corretivas

**Tipos de alerta:**
- 🚨 **Urgente:** ROAS crítico
- ⚠️ **Atenção:** Performance caindo
- 💡 **Oportunidade:** Escalabilidade
- 📈 **Tendência:** Padrões novos

**Configuração:**
1. Dashboard → Alertas Inteligentes
2. Defina sensibilidade (baixa/alta)
3. Escolha canais de notificação
4. Configure horários

🔔 **Resultado:** Nunca perca uma oportunidade ou problema.`,
        relatedTopics: ['ai_recommendations', 'smart_alerts']
      },
      {
        id: 'predictive_analysis',
        name: 'predictive_analysis',
        content: `**Análise preditiva de tendências:**

**Machine Learning Avançado:**
- Algoritmos de deep learning
- Análise de padrões complexos
- Correlações não-óbvias
- Adaptação contínua

**Métricas previstas:**
- Tendências de CTR
- Evolução de CPC
- Padrões de conversão
- Competição de mercado

**Aplicações práticas:**
- Otimização de lances
- Planejamento de orçamento
- Timing de campanhas
- Expansão de palavras-chave

**Confiabilidade:**
- Score de precisão
- Intervalos de confiança
- Validação histórica
- Atualizações em tempo real

🤖 **Vantagem:** Antecipe mudanças do mercado.`,
        relatedTopics: ['forecasting', 'ai_recommendations']
      }
    ]
  },
  {
    id: 'analytics',
    name: 'analytics',
    description: 'analytics',
    icon: '📈',
    topics: [
      {
        id: 'detailed_metrics',
        name: 'detailed_metrics',
        content: `**Métricas detalhadas (CTR, CPC, ROAS, etc.):**

**Métricas de Performance:**
- **CTR (Click-Through Rate):** Taxa de cliques
- **CPC (Cost Per Click):** Custo por clique
- **CPM (Cost Per Mille):** Custo por mil impressões
- **CPA (Cost Per Acquisition):** Custo por aquisição

**Métricas Financeiras:**
- **ROAS:** Retorno sobre gasto com anúncios
- **ROI:** Retorno sobre investimento
- **Lucro Líquido:** Receita - Custo total
- **Margem de Lucro:** Percentual de lucro

**Métricas de Qualidade:**
- **Pontuação de Qualidade:** Relevância do anúncio
- **Impressão Share:** Participação de mercado
- **Posição Média:** Ranking dos anúncios

💡 **Insight:** Cada métrica conta uma parte da história.`,
        relatedTopics: ['understand_metrics', 'conversion_funnel']
      },
      {
        id: 'conversion_funnel',
        name: 'conversion_funnel',
        content: `**Análise do funil de conversão:**

**Estágios do funil:**
- **Topo:** Impressões → Cliques
- **Meio:** Cliques → Visitantes
- **Fundo:** Visitantes → Conversões

**Métricas por estágio:**
1. **Taxa de Cliques (CTR)**
2. **Taxa de Rejeição**
3. **Taxa de Conversão**
4. **Valor médio por conversão**

**Análise de gargalos:**
- Identifique onde há mais perda
- Otimize etapas específicas
- Melhore experiência do usuário
- Teste diferentes abordagens

**Visualização:**
- Gráfico de funil interativo
- Comparação entre campanhas
- Evolução temporal
- Segmentação demográfica

🎯 **Objetivo:** Maximizar conversões em cada etapa.`,
        relatedTopics: ['detailed_metrics', 'demographic_data']
      },
      {
        id: 'demographic_data',
        name: 'demographic_data',
        content: `**Dados demográficos e segmentação:**

**Segmentações disponíveis:**
- **Idade:** Faixas etárias detalhadas
- **Gênero:** Distribuição masculino/feminino
- **Localização:** Cidade, estado, país
- **Dispositivo:** Desktop, mobile, tablet
- **Horário:** Picos de atividade

**Insights demográficos:**
- Perfil do público-alvo
- Comportamento por segmento
- Performance por demografia
- Oportunidades não exploradas

**Otimização:**
- Ajuste de lances por segmento
- Horários ideais por público
- Criação de anúncios personalizados
- Expansão para novos mercados

📊 **Benefício:** Marketing mais assertivo e eficiente.`,
        relatedTopics: ['conversion_funnel', 'temporal_performance']
      },
      {
        id: 'temporal_performance',
        name: 'temporal_performance',
        content: `**Performance temporal e sazonalidade:**

**Análises temporais:**
- **Horário:** Performance por hora do dia
- **Dia da semana:** Padrões semanais
- **Sazonalidade:** Tendências mensais/anuais
- **Eventos especiais:** Black Friday, Natal, etc.

**Padrões identificados:**
- Picos de conversão
- Horários de menor custo
- Dias mais rentáveis
- Períodos de alta competição

**Otimizações:**
- Programação de lances
- Ajuste de orçamentos
- Campanhas sazonais
- Promoções estratégicas

**Planejamento:**
- Calendário de campanhas
- Previsão de demanda
- Alocação de recursos
- Estratégias antecipadas

📅 **Vantagem:** Estar na hora certa, no lugar certo.`,
        relatedTopics: ['demographic_data', 'market_benchmarking']
      },
      {
        id: 'market_benchmarking',
        name: 'market_benchmarking',
        content: `**Benchmarking com mercado:**

**Comparações disponíveis:**
- **CTR vs. Média do setor**
- **CPC vs. Concorrentes**
- **Taxa de conversão vs. Benchmark**
- **ROAS vs. Mercado**

**Análise competitiva:**
- Posicionamento relativo
- Oportunidades de melhoria
- Gaps de performance
- Vantagens competitivas

**Fontes de dados:**
- Google Ads Auction Insights
- Dados agregados do setor
- Análise de concorrentes
- Tendências de mercado

**Ações recomendadas:**
- Ajustes estratégicos
- Novos segmentos
- Diferenciação
- Inovação

🏆 **Meta:** Superar a concorrência consistentemente.`,
        relatedTopics: ['temporal_performance', 'detailed_metrics']
      }
    ]
  },
  {
    id: 'campaigns',
    name: 'campaigns',
    description: 'campaigns',
    icon: '🎯',
    topics: [
      {
        id: 'create_manual',
        name: 'create_manual',
        content: `**Criando campanhas manuais:**

**Processo de criação:**
1. **Clique em "Nova Campanha"**
2. **Preencha dados básicos:**
   - Nome da campanha
   - Moeda (BRL/USD)
   - Estratégia de lances
   - Orçamento

3. **Configure métricas:**
   - Impressões
   - Cliques
   - Conversões
   - CPC médio

**Campos avançados:**
- Visitantes únicos
- Checkouts realizados
- Comissão por conversão
- Métricas de qualidade

**Validações automáticas:**
- Cálculo de CTR
- ROI projetado
- Margem de lucro
- Alertas de performance

✅ **Resultado:** Campanha pronta para monitoramento.`,
        relatedTopics: ['google_ads_sync', 'templates']
      },
      {
        id: 'google_ads_sync',
        name: 'google_ads_sync',
        content: `**Sincronização com Google Ads:**

**Configuração inicial:**
1. **Configure webhook** no Google Ads Setup
2. **Copie URL gerada** pelo sistema
3. **Instale script** no Google Ads Scripts
4. **Configure execução** automática diária

**Dados sincronizados:**
- Impressões em tempo real
- Cliques e CTR
- Custos e CPC
- Conversões e valor

**Benefícios:**
- Atualizações automáticas
- Dados sempre atuais
- Redução de trabalho manual
- Maior precisão

**Monitoramento:**
- Status da sincronização
- Última atualização
- Erros de conexão
- Logs detalhados

🔄 **Automação:** Seus dados sempre atualizados.`,
        relatedTopics: ['create_manual', 'webhooks']
      },
      {
        id: 'bulk_operations',
        name: 'bulk_operations',
        content: `**Operações em massa (bulk actions):**

**Ações disponíveis:**
- **Pausar/Ativar** múltiplas campanhas
- **Editar orçamentos** em lote
- **Atualizar comissões** globalmente
- **Exportar dados** selecionados

**Seleção eficiente:**
- Filtros avançados
- Seleção por critérios
- Ctrl+clique múltiplo
- Selecionar todas

**Operações seguras:**
- Preview antes de aplicar
- Confirmação de alterações
- Backup automático
- Rollback disponível

**Casos de uso:**
- Ajustes sazonais
- Padronização de configurações
- Otimizações em massa
- Manutenção periódica

⚡ **Eficiência:** Gerencie centenas de campanhas rapidamente.`,
        relatedTopics: ['templates', 'change_history']
      },
      {
        id: 'templates',
        name: 'templates',
        content: `**Usando templates pré-configurados:**

**Templates disponíveis:**
- **E-commerce:** Configuração para lojas online
- **Lead Generation:** Foco em captura de leads
- **Brand Awareness:** Campanhas de marca
- **App Install:** Promoção de aplicativos

**Personalização:**
- Ajuste métricas específicas
- Configure comissões
- Defina orçamentos
- Customize alertas

**Criação de templates:**
1. Configure campanha modelo
2. Salve como template
3. Nomeie e descreva
4. Compartilhe com equipe

**Benefícios:**
- Padronização de processos
- Redução de erros
- Economia de tempo
- Melhores práticas

📝 **Produtividade:** Reutilize configurações testadas.`,
        relatedTopics: ['create_manual', 'bulk_operations']
      },
      {
        id: 'change_history',
        name: 'change_history',
        content: `**Histórico de mudanças:**

**Rastreamento completo:**
- Todas as alterações registradas
- Data e hora exatas
- Usuário responsável
- Valores antes/depois

**Tipos de mudança:**
- Edições de campanha
- Alterações de orçamento
- Mudanças de status
- Atualizações de métricas

**Visualização:**
- Timeline cronológica
- Comparação lado a lado
- Filtros por período/usuário
- Busca por campanha

**Funcionalidades:**
- Restaurar versões anteriores
- Análise de impacto
- Auditoria de performance
- Compliance e segurança

🕒 **Controle:** Saiba exatamente o que mudou e quando.`,
        relatedTopics: ['bulk_operations', 'templates']
      }
    ]
  },
  {
    id: 'technical',
    name: 'technical',
    description: 'technical',
    icon: '⚙️',
    topics: [
      {
        id: 'custom_scripts',
        name: 'custom_scripts',
        content: `**Scripts personalizados e automações:**

**Google Ads Scripts:**
- Script de sincronização automática
- Coleta de dados em tempo real
- Execução programada
- Tratamento de erros

**Customizações disponíveis:**
- Frequência de sincronização
- Métricas específicas
- Filtros de campanha
- Formatação de dados

**Configuração avançada:**
1. Acesse Google Ads Scripts
2. Cole código fornecido
3. Configure parâmetros
4. Teste execução
5. Programe automação

**Monitoramento:**
- Logs de execução
- Status de saúde
- Alertas de falha
- Performance metrics

🔧 **Automação:** Configure uma vez, funciona para sempre.`,
        relatedTopics: ['webhooks', 'api_integration']
      },
      {
        id: 'webhooks',
        name: 'webhooks',
        content: `**Configuração de webhooks:**

**O que são webhooks:**
- URLs que recebem dados
- Comunicação em tempo real
- Integração automática
- Redução de trabalho manual

**Configuração passo a passo:**
1. **Criar webhook** no CLICK SYNC
2. **Copiar URL** gerada
3. **Configurar no Google Ads** Script
4. **Testar conexão**
5. **Ativar automação**

**Dados transmitidos:**
- Métricas de campanha
- Performance em tempo real
- Custos e receitas
- Conversões e valores

**Segurança:**
- URLs únicas e seguras
- Validação de origem
- Logs de acesso
- Controle de permissões

🔗 **Conectividade:** Seus sistemas conversando automaticamente.`,
        relatedTopics: ['custom_scripts', 'api_integration']
      },
      {
        id: 'api_integration',
        name: 'api_integration',
        content: `**Integração via API própria:**

**API REST CLICK SYNC:**
- Endpoints documentados
- Autenticação segura
- Rate limiting
- Versionamento

**Operações disponíveis:**
- Criar/editar campanhas
- Consultar métricas
- Exportar relatórios
- Gerenciar configurações

**Casos de uso:**
- Integração com CRM
- Dashboards personalizados
- Automações avançadas
- Relatórios customizados

**Documentação:**
- Guia de início rápido
- Exemplos de código
- Referência completa
- SDKs disponíveis

**Suporte técnico:**
- Documentação detalhada
- Exemplos práticos
- Suporte via ticket
- Comunidade de desenvolvedores

🔌 **Flexibilidade:** Integre com qualquer sistema.`,
        relatedTopics: ['webhooks', 'data_backup']
      },
      {
        id: 'data_backup',
        name: 'data_backup',
        content: `**Backup automático de dados:**

**Sistema de backup:**
- Backup diário automático
- Múltiplas versões mantidas
- Armazenamento seguro
- Recuperação rápida

**Dados protegidos:**
- Campanhas e configurações
- Histórico de performance
- Configurações de usuário
- Relatórios e exports

**Recuperação:**
- Restauração pontual
- Recuperação seletiva
- Backup sob demanda
- Verificação de integridade

**Segurança:**
- Criptografia em trânsito
- Armazenamento criptografado
- Acesso controlado
- Logs de auditoria

**Políticas:**
- Retenção de 90 dias
- Backups incrementais
- Validação automática
- Relatórios de status

💾 **Tranquilidade:** Seus dados sempre protegidos.`,
        relatedTopics: ['api_integration', 'security_settings']
      },
      {
        id: 'security_settings',
        name: 'security_settings',
        content: `**Configurações de segurança:**

**Autenticação:**
- Login seguro (2FA disponível)
- Senhas criptografadas
- Sessões controladas
- Logout automático

**Controle de acesso:**
- Permissões por usuário
- Níveis de acesso
- Auditoria de ações
- Histórico de login

**Proteção de dados:**
- Criptografia end-to-end
- Comunicação SSL/TLS
- Armazenamento seguro
- Compliance LGPD

**Monitoramento:**
- Tentativas de acesso
- Atividades suspeitas
- Alertas de segurança
- Logs detalhados

**Configurações:**
1. Acesse Configurações de Segurança
2. Configure 2FA
3. Revise permissões
4. Ative alertas

🔒 **Proteção:** Máxima segurança para seus dados.`,
        relatedTopics: ['data_backup', 'custom_scripts']
      }
    ]
  },
  {
    id: 'troubleshooting',
    name: 'troubleshooting',
    description: 'troubleshooting',
    icon: '🔧',
    topics: [
      {
        id: 'sync_issues',
        name: 'sync_issues',
        content: `**Problemas de sincronização:**

**Problemas comuns:**
- Dados não atualizando
- Webhook sem resposta
- Script não executando
- Métricas inconsistentes

**Diagnóstico:**
1. **Verifique status** do webhook
2. **Confira logs** de execução
3. **Teste conectividade**
4. **Valide configurações**

**Soluções:**
- Reconfigurar webhook
- Atualizar script Google Ads
- Verificar permissões
- Contactar suporte

**Prevenção:**
- Monitoramento automático
- Alertas de falha
- Backup de configurações
- Documentação atualizada

🔄 **Status:** Verifique sempre a última sincronização.`,
        relatedTopics: ['google_ads_errors', 'webhooks']
      },
      {
        id: 'google_ads_errors',
        name: 'google_ads_errors',
        content: `**Erros de integração Google Ads:**

**Códigos de erro comuns:**
- **401:** Falha na autenticação
- **403:** Permissões insuficientes  
- **429:** Limite de requisições
- **500:** Erro interno do servidor

**Problemas frequentes:**
- Script não autorizado
- Conta Google Ads suspensa
- Limites de API excedidos
- Configuração incorreta

**Soluções passo a passo:**
1. **Verificar autorização** no Google Ads
2. **Confirmar permissões** da conta
3. **Reautorizar script** se necessário
4. **Contactar Google Ads** em casos graves

**Logs úteis:**
- Execution transcript no Google Ads
- Logs do webhook no CLICK SYNC
- Mensagens de erro detalhadas
- Timestamps das tentativas

🚨 **Importante:** Sempre verifique os logs primeiro.`,
        relatedTopics: ['sync_issues', 'custom_scripts']
      },
      {
        id: 'metrics_not_updating',
        name: 'metrics_not_updating',
        content: `**Métricas não atualizando:**

**Possíveis causas:**
- Script Google Ads pausado
- Problema na sincronização
- Cache do navegador
- Configuração incorreta

**Verificações básicas:**
1. **Último sync:** Confira timestamp
2. **Status webhook:** Verde = OK
3. **Script Google Ads:** Deve estar ativo
4. **Cache:** Faça hard refresh (Ctrl+F5)

**Soluções rápidas:**
- Forçar sincronização manual
- Limpar cache do navegador
- Reautorizar integrações
- Verificar logs de erro

**Escalação:**
- Se problema persistir > 24h
- Métricas críticas não atualizando
- Múltiplas campanhas afetadas
- Dados completamente ausentes

⏱️ **Tempo:** Dados devem atualizar em até 2 horas.`,
        relatedTopics: ['sync_issues', 'login_issues']
      },
      {
        id: 'login_issues',
        name: 'login_issues',
        content: `**Problemas de login/acesso:**

**Cenários comuns:**
- Senha esquecida
- Conta bloqueada
- Erro de permissões
- Sessão expirada

**Soluções imediatas:**
1. **Reset de senha:** Use "Esqueci minha senha"
2. **Limpar cookies:** Do navegador
3. **Tentar navegador** diferente
4. **Verificar Caps Lock**

**Conta bloqueada:**
- Aguardar 15 minutos
- Tentar reset de senha
- Contactar administrador
- Verificar email de notificação

**Problemas técnicos:**
- Desabilitar extensões
- Tentar modo incógnito
- Verificar conexão
- Atualizar navegador

**Suporte urgente:**
- WhatsApp: +55 11 99999-9999
- Email: suporte@clicksync.com
- Chat online: 24/7

🔐 **Acesso:** Mantenha suas credenciais seguras.`,
        relatedTopics: ['slow_performance', 'security_settings']
      },
      {
        id: 'slow_performance',
        name: 'slow_performance',
        content: `**Performance lenta do sistema:**

**Causas comuns:**
- Muitos dados carregando
- Conexão lenta
- Cache sobrecarregado
- Múltiplas abas abertas

**Otimizações rápidas:**
1. **Feche abas** desnecessárias
2. **Limpe cache** do navegador
3. **Use filtros** para reduzir dados
4. **Verifique conexão** de internet

**Configurações ideais:**
- Chrome/Firefox atualizados
- Mínimo 4GB RAM
- Conexão 10Mbps+
- JavaScript habilitado

**Filtros inteligentes:**
- Limite período de análise
- Selecione campanhas específicas
- Use presets otimizados
- Exporte dados grandes

**Monitore:**
- Velocidade de carregamento
- Uso de memória
- Conexão de rede
- Erros do console

⚡ **Performance:** Sistema otimizado para grandes volumes.`,
        relatedTopics: ['metrics_not_updating', 'troubleshooting']
      }
    ]
  },
  {
    id: 'support',
    name: 'support',
    description: 'support',
    icon: '🎧',
    topics: [
      {
        id: 'contact_support',
        name: 'contact_support',
        content: `**Como entrar em contato com suporte:**

**Canais disponíveis:**
- **Chat online:** 24/7 no canto inferior direito
- **Email:** suporte@clicksync.com
- **WhatsApp:** +55 11 99999-9999
- **Ticket:** Sistema interno de chamados

**Informações úteis:**
- Descreva o problema claramente
- Inclua screenshots se possível
- Mencione navegador/sistema
- Informe horário do problema

**Prioridades:**
- 🔴 **Crítico:** Sistema fora do ar (1h)
- 🟡 **Alto:** Funcionalidade comprometida (4h)
- 🟢 **Normal:** Dúvidas gerais (24h)
- 🔵 **Baixo:** Melhorias/sugestões (48h)

**Antes de contactar:**
- Verifique este FAQ
- Teste em navegador diferente
- Confira status do sistema
- Tente soluções básicas

📞 **Disponibilidade:** Estamos aqui para ajudar!`,
        relatedTopics: ['business_hours', 'available_training']
      },
      {
        id: 'business_hours',
        name: 'business_hours',
        content: `**Horários de atendimento:**

**Suporte 24/7:**
- **Chat online:** Sempre disponível
- **Sistema automático:** Respostas imediatas
- **Bot inteligente:** Soluções rápidas

**Suporte humano:**
- **Segunda a Sexta:** 8h às 18h (Brasília)
- **Finais de semana:** 9h às 15h
- **Feriados:** Plantão reduzido

**Suporte especializado:**
- **Técnico:** Segunda a Sexta 9h-17h
- **Financeiro:** Segunda a Sexta 8h-16h
- **Comercial:** Segunda a Sexta 8h-18h

**Emergências:**
- Sistema fora do ar: Atendimento imediato
- Problemas críticos: Escalação automática
- WhatsApp urgente: Resposta em 30min

**Timezone:**
- Todos os horários em Brasília (GMT-3)
- Atendimento em português e inglês
- Suporte técnico em inglês sob demanda

🕐 **Sempre disponível:** Para quando você precisar.`,
        relatedTopics: ['contact_support', 'user_community']
      },
      {
        id: 'available_training',
        name: 'available_training',
        content: `**Treinamentos disponíveis:**

**Onboarding gratuito:**
- **Primeira configuração:** 1h individual
- **Tour pelo sistema:** Demonstração completa
- **Setup Google Ads:** Integração assistida
- **Primeiras campanhas:** Criação guiada

**Treinamentos avançados:**
- **Analytics avançado:** Interpretação de dados
- **Otimização de campanhas:** Melhores práticas
- **Automações:** Scripts e integrações
- **ROI mastery:** Maximização de resultados

**Formatos disponíveis:**
- **Presencial:** São Paulo e Rio de Janeiro
- **Online:** Zoom/Teams individual ou grupo
- **Video-aulas:** Biblioteca de conteúdo
- **Webinars:** Sessões semanais gratuitas

**Certificação:**
- **CLICK SYNC Certified:** Programa oficial
- **Especialista em ROI:** Certificação avançada
- **Integrador autorizado:** Para parceiros

**Agendamento:**
- Email: treinamento@clicksync.com
- WhatsApp: +55 11 98888-8888
- Portal de agendamento online

🎓 **Capacitação:** Do básico ao avançado.`,
        relatedTopics: ['user_community', 'feature_request']
      },
      {
        id: 'user_community',
        name: 'user_community',
        content: `**Comunidade de usuários:**

**Canais oficiais:**
- **Telegram:** @ClickSyncUsers (2000+ membros)
- **Discord:** Servidor oficial com salas temáticas
- **LinkedIn:** Grupo CLICK SYNC Professionals
- **YouTube:** Canal com tutoriais semanais

**Atividades:**
- **Q&A semanal:** Terças 19h
- **Cases de sucesso:** Compartilhamento mensal
- **Beta testing:** Novos recursos
- **Networking:** Conexões profissionais

**Moderação:**
- Equipe CLICK SYNC presente
- Especialistas voluntários
- Regras claras de convivência
- Suporte rápido da comunidade

**Benefícios:**
- Resolução rápida de dúvidas
- Networking com outros usuários
- Acesso antecipado a recursos
- Influência no roadmap

**Como participar:**
1. Solicite convite no suporte
2. Aceite as regras da comunidade
3. Apresente-se para o grupo
4. Comece a interagir!

👥 **Juntos:** Somos mais fortes em comunidade.`,
        relatedTopics: ['available_training', 'feature_request']
      },
      {
        id: 'feature_request',
        name: 'feature_request',
        content: `**Solicitação de novas funcionalidades:**

**Como sugerir:**
- **Portal de ideias:** ideas.clicksync.com
- **Email:** product@clicksync.com
- **Comunidade:** Discussão com outros usuários
- **Pesquisas:** Participe das consultas oficiais

**Informações necessárias:**
- Descrição detalhada da necessidade
- Problema que resolve
- Casos de uso específicos
- Benefício esperado
- Urgência/prioridade

**Processo de avaliação:**
1. **Análise:** Equipe de produto revisa
2. **Viabilidade:** Estudo técnico
3. **Priorização:** Roadmap placement
4. **Feedback:** Retorno ao solicitante
5. **Desenvolvimento:** Se aprovado

**Critérios de priorização:**
- Impacto no usuário
- Número de solicitações
- Complexidade técnica
- Alinhamento estratégico

**Timeline típico:**
- Análise: 1-2 semanas
- Desenvolvimento: 1-6 meses
- Beta testing: 2-4 semanas
- Release: Conforme roadmap

💡 **Sua voz:** Ajude a construir o futuro do CLICK SYNC.`,
        relatedTopics: ['user_community', 'contact_support']
      }
    ]
  }
];