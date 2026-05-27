# Global Flow Terminal - Dashboard Financeiro e geopolítico

Plataforma integrada de monitoramento financeiro e geopolítico global desenvolvida com Angular 18+. O sistema consolida múltiplos indicadores de mercado em tempo real através de uma arquitetura modular baseada em Standalone Components, aplicando técnicas avançadas de estilização assimétrica, controle estrito de hidratação, processamento estatístico de dados e responsividade fluida para telas de alta densidade e dispositivos móveis.

---

## Demonstração Visual

![Interface do Global Flow Terminal](dashboard-de-cambio-modular/assets/global-flow-demo.gif)

---

## Engenharia de Software e Diferenciais Técnicos

O desenvolvimento do terminal priorizou práticas rigorosas de governança de código, desacoplamento de camadas e otimização de runtime para aplicações de grande porte no ecossistema Angular:

* **Gerenciamento de Hidratação Seletiva (SSR)**: Implementação estratégica da diretiva ngSkipHydration nos pontos críticos de carregamento dos componentes. Esta abordagem otimiza o ciclo de vida da aplicação quando implantada sob Server-Side Rendering, prevenindo falhas de inconsistência estrutural entre a renderização do servidor e o cliente (hydration mismatches).
* **Sobrescrita Segura de Escopo com CSS Avançado**: Uso do pseudo-seletor ::ng-deep associado a seletores relacionais de primeiro nível (& > *:first-child). Esta técnica soluciona as restrições nativas de View Encapsulation do Angular, forçando o esticamento homogêneo e o preenchimento total das células do grid sem violar a semântica do DOM ou quebrar em ambientes de hospedagem em nuvem.
* **Malha de Layout Bidimensional Estrita**: Arquitetura visual baseada em CSS Grid estruturada em faixas funcionais isoladas. O sistema gerencia o espaço combinando limites estáticos de segurança com frações flexíveis através do operador minmax(380px, 1fr) 2fr, blindando o layout de câmbio contra compressões que prejudicariam a leitura de gráficos.
* **Responsividade Multi-Dispositivo com Breakpoints Calibrados**: Mecanismo adaptativo que reconfigura toda a distribuição espacial da aplicação de acordo com o dispositivo do usuário. Em cenários mobile, o grid é linearizado e componentes complexos de interação, como mapas vetoriais e caixas de ferramentas (tooltips), são convertidos automaticamente para coordenadas absolutas com centralização por matriz.

---

## Arquitetura de Dados e Políticas de Resiliência (Service Layer)

O ecossistema de dados do terminal foi centralizado em uma camada de serviços robusta (CurrencyService) projetada sob os princípios de tolerância a falhas e reatividade híbrida (RxJS + Signals):

* **Tolerância a Falhas e Tentativas Automáticas (Retry Policy)**: O consumo da API de taxas de câmbio internacional (ExchangeRateAPI) conta com políticas de reexecução preventiva através do operador retry(2). Em cenários de microinstabilidades ou perdas momentâneas de pacotes na rede, o sistema realiza até duas tentativas automáticas de reconexão de forma assíncrona antes de propagar qualquer exceção para a camada visual.
* **Degradação Suave com Circuit Breaker Temporal (Timeout & Fallback)**: Para mitigar o impacto de latências elevadas em APIs de terceiros, a consulta de sentimento macroeconômico possui uma trava temporal estrita via timeout(5000). Caso o servidor externo ultrapasse o limite de 5 segundos para responder, o fluxo intercepta o gargalo e injeta um fluxo alternativo seguro (of(...)) com dados de neutralidade mercadológica, garantindo que o carregamento do painel nunca fique bloqueado para o usuário final.
* **Estratégia de Resiliência de Conteúdo (Backup Data Source)**: O agregador de notícias geopolíticas implementa um mecanismo de contingência estático. Caso os provedores de mídia sofram interrupções ou bloqueios de requisições cross-origin (CORS), o sistema aciona de forma automatizada um banco de dados de contingência local estruturado sob o mesmo contrato de tipagem, mantendo a integridade visual e funcional do terminal.
* **Tipagem Dinâmica por Dicionário Computado (Index Signatures)**: O mapeamento das taxas de conversão cambial utiliza estruturas flexíveis via TypeScript avançado ({ [key: string]: number }). Esta modelagem permite o processamento dinâmico e expansível de centenas de moedas globais simultaneamente, mapeando chaves alfanuméricas mutáveis para valores flutuantes de mercado sem a necessidade de acoplamento rígido de contratos.

---

## Reatividade de Interface e Engenharia de UI (Component Layer)

O núcleo visual da plataforma aplica técnicas avançadas de renderização reativa e micro-interações para simular o comportamento de terminais financeiros profissionais de alta frequência:

* **Computação Multiplicativa via Signals**: O mecanismo de conversão monetária realiza o cálculo cross-rate em tempo real através do encadeamento de Signals dinâmicos (valorParaConverter()). A reatividade fina do Angular 18+ garante que a renderização dos novos valores seja cirúrgica e restrita à coluna numérica, de forma granular, eliminando repinturas de tela (repaints) desnecessárias no restante do DOM.
* **Sinalização Visual de Tendência com Loops de Pulsação**: Implementação de inteligência de mercado integrada ao SCSS através de animações estritas de keyframes (pulsar-verde e pulsar-vermelho). O sistema interpreta as variações de spread e ativa pontos de luz pulsantes com expansão de sombra vetorial (box-shadow), simulando visualmente as flutuações de alta e baixa de ativos de forma fluida.
* **Mecanismo de Contingência para Ativos Gráficos (Asset Failover)**: O carregamento de bandeiras vetoriais internacionais possui tratamento de exceções em linha através da captura do evento nativo (error). Caso o servidor CDN de imagens sofra oscilações ou indisponibilidade, o sistema intercepta a falha e injeta instantaneamente uma identidade neutra global, blindando a simetria da interface contra quebras estruturais.
* **Micro-interações de Feedback Tátil (Hover & Focus States)**: O layout conta com animações baseadas em matrizes de transformação (transform: translateX e scale). Ao interagir com as linhas do terminal, o sistema projeta um realce de texto neon com dispersão de luz (text-shadow), fornecendo feedback imediato ao usuário e elevando a ergonomia da experiência de análise de dados.

---

## Processamento de Indicadores e Normalização de Layout (Data Metrics Layer)

O monitoramento de taxas referenciais aplica lógicas de tratamento de fluxos e injeção de propriedades computadas para garantir escalabilidade visual e conformidade de dados:

* **Mutabilidade Granular de Coleções Complexas**: A atualização de dados em tempo real para indicadores nacionais adota o método .update() exposto pela API de Signals. Através de algoritmos de mapeamento imutável (lista.map), o sistema intercepta e substitui cirurgicamente a métrica de valor da taxa SELIC sem a necessidade de instanciar novas referências para a coleção inteira, otimizando o consumo de memória.
* **Normalização Proporcional de Layout (Data-Driven Styling)**: O dimensionamento das barras de progresso utiliza equações de conversão em tempo real inseridas diretamente no encadeamento do template ([style.width.%]). O sistema normaliza as taxas de juros nominais contra um teto técnico referencial de 15%, transformando flutuações macroeconômicas brutas em dimensões de largura exatas e fluidas.
* **Injeção Isolada de Formatação Numérica (Format Pipeline)**: O tratamento de frações decimais e a exibição de strings monetárias ou percentuais utilizam instâncias locais de DecimalPipe encapsuladas na matriz de providers do componente. Esta estratégia garante o isolamento do pipeline de formatação, prevenindo acoplamentos globais e vazamentos de escopo de formatação entre componentes irmãos do terminal.
* **Estratégias de Fallback Operacional para Serviços do Banco Central**: O fluxo de captação de dados macroeconômicos possui proteção para cenários de rejeição ou indisponibilidade de requisições do Banco Central do Brasil. O interceptador de erros captura a falha e aciona de forma imediata um valor de contingência estável (10.75%), impedindo falhas em runtime causadas por processamento de valores indefinidos ou nulos (NaN).

---

## Integração de Motores Gráficos e Vetorização Dinâmica (Analytics Layer)

O terminal implementa painéis analíticos complexos utilizando a engine de alta performance Apache ECharts (ngx-echarts) para o monitoramento de liquidez global:

* **Isolamento de Motores Gráficos em Escopo SSR (Engine Shielding)**: A inicialização das propriedades do construtor gráfico é totalmente protegida através da injeção do token PLATFORM_ID. Como bibliotecas de renderização vetorial dependem de cálculos geométricos nativos do navegador (window, canvas), a lógica de instanciação é blindada via isPlatformBrowser, andando falhas de runtime e inconsistências de build no servidor.
* **Mapeamento de Estilização Condicional por Vetor de Dados**: O motor de renderização da série de barras horizontais processa uma esteira de dados tipada sob o contrato AtivoFluxo. O sistema avalia o sinal matemático do valor financeiro (positivo ou negativo) e injeta em runtime mapas de propriedades visuais específicos, alterando cores hexadecimais, arredondamentos geométricos e dispersão de brilho volumétrico (shadowBlur) sem a necessidade de mutações manuais no DOM.
* **Gerenciamento de Configurações Gráficas via Signals**: A interface de opções do gráfico é empacotada em um signal<EChartsOption | null>. Esta modelagem, combinada à estratégia ChangeDetectionStrategy.OnPush, assegura que as estruturas de eixos (xAxis/yAxis) e matrizes de delimitação espacial (grid) trafeguem de forma puramente imutável na aplicação, garantindo máxima performance e respostas instantâneas a atualizações visuais.
* **Otimização de Escala e Formatação de Sufixos Econômicos**: O pipeline de renderização gráfica aplica parametrizações avançadas para omitir linhas de divisão de grade secundárias (splitLine: { show: false }), desobstruindo a interface neumórfica do terminal. Adicionalmente, as legendas de valores absolutos utilizam mecanismos nativos de formatação por string (formatter: '{c}B'), exibindo as métricas financeiras em bilhões diretamente no visor.

---

## Sistemas de Navegação Inteligente e Ergonomia de Interface (Navigation Layer)

O topo da plataforma atua como o painel central de comandos, integrando sistemas de busca conceitual e alternâncias de estado protegidas para colocar a usabilidade em foco em ambientes de dados densos:

* **Mecanismo de Rolagem e Ancoragem por Dicionário Computado**: O sistema de buscas implementa uma esteira de navegação inteligente baseada em uma matriz de mapeamento estrito (Record<string, string>). Ao interpretar palavras-chave inseridas pelo usuário, o componente dispara o método nativo scrollIntoView configurado com rolagem fluida (behavior: 'smooth'), centralizando automaticamente o widget alvo no vetor geométrico do monitor (block: 'center').
* **Sinalização Visual por Destaque Temporário (Search Highlighting)**: Integrado ao motor de ancoragem, o componente manipula o ciclo de classes do DOM através de um temporizador de descarte (setTimeout). Ao alcançar o elemento destino da busca, uma classe de realce visual é injetada para guiar o foco atencional do usuário, sendo automaticamente expurgada após 2000 milissegundos para manter a limpeza estética do terminal.
* **Rotação Segura de Assets sob Controle de Ciclo de Vida**: O sistema de transição cíclica de imagens utiliza equações baseadas em operador de resto aritmético (%) para garantir a alternância infinita e segura de índices de arrays. O bloco de execução é encapsulado sob a proteção isPlatformBrowser, impedindo que rotinas de agendamento de background (setInterval) travem o processo de renderização inicial em servidores de compilação assíncrona.
* **Desacoplamento e Comunicação entre Componentes por Gatilhos de Tempo**: A busca injeta uma marcação de tempo única (Date.now()) no Signal triggerBusca hospedado na camada de serviço. Essa abordagem força a reavaliação de componentes filhos dependentes mesmo se o usuário pesquisar consecutivamente pelo mesmo termo, assegurando a consistência e a reatividade do sistema de busca.

---

## Sistemas de Geo-Inteligência e Processamento de Telas Vetoriais (Geo-Analytics Layer)

O monitoramento geopolítico e cross-asset integra dados cartográficos de alta fidelidade e esteiras de processamento declarativo utilizando malhas vetoriais GeoJSON e Apache ECharts:

* **Gerenciamento de Efeitos Colaterais com Ciclo de Vida Preditivo (Signals Effects)**: A sincronização entre o barramento de dados macroeconômicos e o mapa vetorial utiliza o construtor declarativo moderno effect(). Este mecanismo monitora as mutações nos Signals de estado (listaMoedas) e intercala automaticamente fluxos de reestilização gráfica e focagem geográfica por despacho de ações, eliminando ciclos de checagem imperativos (ngOnChanges) e blindando a performance do runtime.
* **Injeção Assíncrona de Malhas Cartográficas Decoupladas**: O componente implementa o carregamento desacoplado de dados cartográficos globais através de requisições HTTP locais direcionadas a estruturas GeoJSON (world.json). O fluxo intercepta o payload, realiza o cast de segurança estrutural e o injeta dinamicamente na engine gráfica através do método de registro centralizado echarts.registerMap(), viabilizando interfaces geográficas escaláveis e dinâmicas.
* **Orquestração de Eventos Programáticos via Canvas Actions**: O motor de buscas geopolíticas utiliza a API nativa de mensageria interna do ECharts através do despacho controlado de ações (dispatchAction). O sistema interpreta o dicionário semântico e multilíngue de entrada (Record<string, string>), reconfigura os vetores de aproximação linear (zoom) e destaca geograficamente o território mapeado via ações assíncronas de geoSelect.
* **Mecanismos de Recálculo Geométrico e Redimensionamento Fluido**: Para neutralizar distorções visuais e o esmagamento de Canvas comuns em contêineres asynchronos, a inicialização da instância gráfica é encapsulada sob uma fila de microtasks controladas (setTimeout). Este tratamento adia o gatilho da função resize() por milissegundos cirúrgicos, aguardando a estabilização estrutural do layout grid antes de reavaliar as proporções físicas do mapa.
* **Estilização Cross-Asset de Alta Dispersão Visual**: O algoritmo de geração de dados cartográficos cruza as oscilações de moedas fiat com dados geopolíticos críticos estruturados. O motor aplica coeficientes de dispersão de sombra neon (shadowBlur: 25) e gradientes de opacidade nas áreas delimitadas dos países em runtime, transformando strings financeiras puras em alertas geográficos de alta legibilidade.

---

## Tipagem Estrita de Domínio e Controle de Fluxos Informativos (Intelligence Layer)

O monitoramento de eventos geoestratégicos utiliza restrições de tipos em nível de compilador e estruturas de dados semânticas para garantir integridade e interoperabilidade com os motores de busca do ecossistema:

* **Restrição de Estados por Tipos Literais Combinados**: A modelagem de payloads informativos adota o uso estrito de Tipos Literais de união ('CRÍTICO' | 'ATENÇÃO' | 'MONITORANDO') sob o contrato da interface AlertaGeopolitico. Esta abordagem blinda a aplicação contra a injeção de categorias de status inválidas em runtime, forçando a conformidade com as regras de negócio diretamente na camada de compilação do TypeScript.
* **Isolamento de Estado Estático via Estratégias Passivas**: O componente consolida seus dados através de fluxos de Signals imutáveis gerenciados sob a diretiva ChangeDetectionStrategy.OnPush. Esta configuração desvincula o widget de verificações de ciclo de vida desnecessárias provocadas por eventos originados em componentes irmãos, liberando ciclos de processamento e mantendo a alta performance do terminal.
* **Interoperabilidade Semântica com Motores de Ancoragem**: A catalogação das propriedades geográficas de descrição e local foi projetada de forma normalizada para atuar em total conformidade com o dicionário de busca estruturado global (Record<string, string>). Essa engenharia de dados viabiliza que palavras-chave contextuais acionem perfeitamente as rotinas corporativas de rolagem suave (scrollIntoView) e realce gráfico de contêineres.

---

## Ingestão de Conteúdo Assíncrono e Resiliência de Mídia (Feed & Content Layer)

O ecossistema de captura de feeds e dados de agências de notícias globais implementa fluxos reativos controlados e tratamentos de falhas de renderização assíncronas para garantir estabilidade visual sob alta volatilidade de rede:

* **Gerenciamento de Estados de Transição Reativa (Loading States)**: A interface gerencia o ciclo de carregamento assíncrono através de Signals booleanos dedicados (carregando). O estado é modificado cirurgicamente nas esteiras de sucesso ou falha das assinaturas do serviço, permitindo a transição fluida de skeletons de interface sem sobressaltos e sem dependências de verificações imperativas globais.
* **Mecanismo de Interceptação contra Loops de Falhas de Ativos (Media Failover Security)**: A função de substituição de imagens quebradas (substituirImagemErro) adota uma validação de igualdade baseada na URL de contingência. Este controle preventivo quebra loops infinitos de disparo do evento nativo (error) caso a própria imagem substituta sofra instabilidades no servidor de origem, mitigando o travamento da thread de renderização da aplicação.
* **Segurança de Tipagem por Contratos de Integração**: A manipulação de payloads de mídia internacional é estruturada sob a interface estrita Noticia. Esta abordagem elimina o uso de propriedades dinâmicas soltas (any[]), forçando a conformidade de dados para títulos, links de origem corporativa (Reuters, Bloomberg) e caminhos de arquivos diretamente no ambiente de design e compilação do TypeScript.

---

## Computação de Estados Derivados e Análise Estatística (Data Intelligence Layer)

A plataforma incorpora um mecanismo automatizado de síntese e inteligência analítica (RelatorioFechamentoComponent) baseado no processamento reativo e imutável de vetores de mercado:

* **Computação Passiva e Otimizada de Estados Derivados (Computed Signals)**: A geração do balanço diário de mercado utiliza o construtor funcional computed<RelatorioMercado | null>. Esta engenharia de reatividade do Angular 18+ vincula o cálculo analítico ao Signal de dados brutos da camada de serviço, garantindo que algoritmos complexos de ordenação e classificação rodem estritamente quando novas taxas de câmbio são injetadas, otimizando o consumo de CPU.
* **Garantia de Imutabilidade em Operações de Matrizes (Pure Sorting Functions)**: O algoritmo de triagem de ativos aplica o operador de propagação ([...moedas]) para instanciar uma cópia isolada do array antes de acionar a função nativa .sort(). Esta abordagem de programação pura protege a integridade e as referências originais do repositório central de dados do serviço, criando uma blindagem contra efeitos colaterais indesejados em componentes irmãos.
* **Mecanismo de Inferência Semântica de Sentimento Macroeconômico**: O terminal computa o estado de sentimento macroeconômico através de equações estatísticas em tempo real, avaliando o comportamento cross-asset da carteira de divisas globais. Caso a taxa de valorização dos ativos ultrapasse a barreira fracionária de 50% do volume total da coleção, o sistema injeta chaves litelas estritas de otimismo ou cautela na interface, fornecendo resumos executivos consolidados de forma automatizada.

---

## Tecnologias e Recursos Utilizados

* **Angular 18+**: Arquitetura moderna em Standalone Components, Signals de Reatividade Granular e controle estrutural de fluxo nativo.
* **TypeScript Avançado**: Tipagem estrita de contratos de domínio, Index Signatures para mapeamento de mapas dinâmicos e literal types combinados.
* **Apache ECharts & NgxEcharts**: Motor gráfico e cartográfico vetorial de alto desempenho para manipulação geométrica em Canvas.
* **RxJS Pipeline**: Operadores funcionais assíncronos (timer, switchMap, map, catchError, retry e timeout) estruturados para gerenciar fluxos de rede e contingências.
* **SCSS Comercial**: Estrutura modular de folhas de estilo, heranças aninhadas lógicas, mixins de reutilização e manipulações de seletores de árvore (::ng-deep).

---

## Indicadores de Auditoria e Desempenho (Performance & Quality Metrics)

A plataforma foi submetida à auditoria oficial do Google Lighthouse na simulação para dispositivos móveis, apresentando os seguintes indicadores de qualidade de software:

* **Acessibilidade (96/100)**: Elevado índice de conformidade com as diretrizes da WCAG, garantindo semântica correta de tags, contrastes adequados e navegação acessível.
* **Melhores Práticas (96/100)**: Código em conformidade estrita com os padrões modernos de segurança da Web API, uso de conexões seguras (HTTPS) e ausência de APIs legadas ou depreciadas.
* **SEO (83/100)**: Estruturação otimizada de metadados, títulos e viewport para indexação automatizada em motores de busca.

---

## Instruções para Execução do Projeto

Por utilizar uma estrutura modular moderna em Angular, a aplicação necessita do ecossistema Node.js instalado na máquina:

1. Clone o repositório utilizando o comando:
   ```bash
   git clone https://github.com
   ```
2. Instale os pacotes e dependências de desenvolvimento do projeto:
   ```bash
   npm install
   ```
3. Inicialize o servidor de desenvolvimento local:
   ```bash
   ng serve
   ```
4. Acesse o sistema através do endereço fornecido pelo compilador em seu navegador local: `http://localhost:4200`
