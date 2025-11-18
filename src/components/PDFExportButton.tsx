import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { Campaign } from '@/contexts/CampaignContext';
import { DashboardMetrics } from '@/hooks/useDashboardCalculations';

interface PDFExportButtonProps {
  campaigns: Campaign[];
  metrics: DashboardMetrics;
  dashboardCurrency: 'BRL' | 'USD';
  exchangeRate?: number | null;
}

export const PDFExportButton: React.FC<PDFExportButtonProps> = ({
  campaigns,
  metrics,
  dashboardCurrency,
  exchangeRate
}) => {
  const { t } = useTranslation();
  const handleExportPDF = async () => {
    try {
      // Criar um documento HTML temporário com os dados do dashboard
      const currentDate = new Date().toLocaleDateString('pt-BR');
      const currentTime = new Date().toLocaleTimeString('pt-BR');
      
      const formatCurrency = (value: number) => {
        const locale = dashboardCurrency === 'BRL' ? 'pt-BR' : 'en-US';
        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: dashboardCurrency
        }).format(value);
      };

      const formatNumber = (value: number) => {
        return new Intl.NumberFormat('pt-BR').format(value);
      };

      // HTML do relatório
      const reportHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Relatório Dashboard - CLICK DEFENDER</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #2563eb;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 10px;
            }
            .date-info {
              color: #666;
              font-size: 14px;
            }
            .section {
              margin-bottom: 30px;
            }
            .section-title {
              font-size: 20px;
              font-weight: bold;
              color: #2563eb;
              border-bottom: 1px solid #e5e5e5;
              padding-bottom: 10px;
              margin-bottom: 15px;
            }
            .metrics-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 20px;
              margin-bottom: 20px;
            }
            .metric-card {
              border: 1px solid #e5e5e5;
              border-radius: 8px;
              padding: 15px;
              background: #f9f9f9;
            }
            .metric-label {
              font-size: 14px;
              color: #666;
              margin-bottom: 5px;
            }
            .metric-value {
              font-size: 24px;
              font-weight: bold;
              color: #333;
            }
            .campaign-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            .campaign-table th,
            .campaign-table td {
              border: 1px solid #e5e5e5;
              padding: 10px;
              text-align: left;
            }
            .campaign-table th {
              background: #f3f4f6;
              font-weight: bold;
            }
            .campaign-table tr:nth-child(even) {
              background: #f9f9f9;
            }
            .footer {
              margin-top: 50px;
              text-align: center;
              color: #666;
              border-top: 1px solid #e5e5e5;
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">CLICK DEFENDER</div>
            <div class="date-info">
              Relatório gerado em ${currentDate} às ${currentTime}<br>
              Taxa de câmbio USD/BRL: ${exchangeRate ? `R$ ${exchangeRate.toFixed(2)}` : 'N/A'}
            </div>
          </div>

          <div class="section">
            <div class="section-title">Resumo Geral</div>
            <div class="metrics-grid">
              <div class="metric-card">
                <div class="metric-label">Total Investido</div>
                <div class="metric-value">${formatCurrency(metrics.totalInvestido)}</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Total Faturado</div>
                <div class="metric-value">${formatCurrency(metrics.totalFaturado)}</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Lucro Total</div>
                <div class="metric-value">${formatCurrency(metrics.lucroTotal)}</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">ROI Médio</div>
                <div class="metric-value">${metrics.roiMedio.toFixed(1)}%</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">ROAS Média</div>
                <div class="metric-value">${metrics.roasMedia.toFixed(2)}</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Campanhas Ativas</div>
                <div class="metric-value">${metrics.campanhasAtivas}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Métricas de Performance</div>
            <div class="metrics-grid">
              <div class="metric-card">
                <div class="metric-label">Impressões Totais</div>
                <div class="metric-value">${formatNumber(metrics.impressoesTotais)}</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Cliques Totais</div>
                <div class="metric-value">${formatNumber(metrics.cliquesTotais)}</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">CTR Médio</div>
                <div class="metric-value">${metrics.ctrMedio.toFixed(2)}%</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">CPC Médio</div>
                <div class="metric-value">${formatCurrency(metrics.cpcMedio)}</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Conversões</div>
                <div class="metric-value">${formatNumber(metrics.conversoes)}</div>
              </div>
              <div class="metric-card">
                <div class="metric-label">Taxa de Conversão</div>
                <div class="metric-value">${metrics.taxaConversaoMedia.toFixed(2)}%</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Campanhas Detalhadas</div>
            <table class="campaign-table">
              <thead>
                <tr>
                  <th>Campanha</th>
                  <th>Investido</th>
                  <th>Faturado</th>
                  <th>ROI</th>
                  <th>Impressões</th>
                  <th>Cliques</th>
                  <th>Conversões</th>
                </tr>
              </thead>
              <tbody>
                ${campaigns.map(campaign => `
                  <tr>
                    <td>${campaign.campanha}</td>
                    <td>${formatCurrency(campaign.custo || 0)}</td>
                    <td>${formatCurrency(campaign.faturamento || 0)}</td>
                    <td>${campaign.roi ? campaign.roi.toFixed(1) + '%' : '0%'}</td>
                    <td>${formatNumber(campaign.impressoes || 0)}</td>
                    <td>${formatNumber(campaign.cliques || 0)}</td>
                    <td>${formatNumber(campaign.conversoes || 0)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="footer">
            <p>Este relatório foi gerado automaticamente pelo sistema CLICK DEFENDER</p>
            <p>Para mais informações, acesse o dashboard completo na plataforma</p>
          </div>
        </body>
        </html>
      `;

      // Criar blob e fazer download
      const blob = new Blob([reportHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio-dashboard-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Mostrar mensagem de sucesso
      console.log('Relatório PDF exportado com sucesso!');
      
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
    }
  };

  return (
    <Button 
      onClick={handleExportPDF}
      variant="outline"
      className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
    >
      <FileText className="w-4 h-4" />
      <Download className="w-4 h-4" />
      {t('dashboard.downloadPDFOverview')}
    </Button>
  );
};