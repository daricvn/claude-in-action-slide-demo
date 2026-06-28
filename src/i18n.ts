import { createSignal } from "solid-js";

/**
 * Localization for the deck. Single source of truth for every user-facing
 * string: UI chrome (hero, nav, modal) and slide content (titles, bullets,
 * insights). Slide *icons* stay structural in `slides.ts` (`SLIDE_ICONS`),
 * aligned by index with `Dict.slides` here.
 *
 * State is a module-level signal so any component can read `locale()` and the
 * single `<LanguageSwitcher>` can flip it. Choice persists to localStorage.
 */
export type Locale = "en" | "vi";

const STORAGE_KEY = "cia-locale";

const initialLocale = (): Locale => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved === "vi" || saved === "en" ? saved : "en";
};

const [locale, setLocaleSignal] = createSignal<Locale>(initialLocale());

export { locale };

export const setLocale = (next: Locale) => {
  setLocaleSignal(next);
  localStorage.setItem(STORAGE_KEY, next);
};

/** Selectable languages — `code`/`label` only. Flag art lives in the switcher. */
export const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "vi", label: "Tiếng Việt" },
];

/** Localized text for one content slide. Pairs with `SLIDE_ICONS[i]`. */
export interface SlideText {
  title: string;
  bullets: string[];
  insight?: string;
}

interface UIStrings {
  heroEyebrow: string;
  heroSubtitle: string;
  presentedBy: string;
  keyInsight: string;
  allSlides: string;
  slidesJump: (n: number) => string;
  watchMempalaceDemo: string;
  changeLanguage: string;
}

interface Dict {
  ui: UIStrings;
  slides: SlideText[];
}

const en: Dict = {
  ui: {
    heroEyebrow: "Enterprise Engineering Keynote",
    heroSubtitle: "Scaling AI workflows for Enterprise Engineering",
    presentedBy: "Presented by Huy Truong, Darick Nguyen",
    keyInsight: "Key Insight: ",
    allSlides: "All Slides",
    slidesJump: (n) => `${n} slides · click to jump`,
    watchMempalaceDemo: "Watch Mempalace Demo",
    changeLanguage: "Change language",
  },
  slides: [
    {
      title: "Agenda",
      bullets: [
        "Part 1 — Foundation & System Design",
        "Part 2 — Technical Deep Dive & Tooling",
        "Part 3 — Optimization, Demo & Takeaways",
      ],
    },
    // ==========================================
    // PART 1: FOUNDATION & SYSTEM DESIGN (DARICK)
    // ==========================================
    {
      title: "Why Enterprise-Scale AI Assistance Needs More Than Prompts",
      bullets: [
        "Prompts don’t scale: every session restarts from zero context.",
        "Enterprise code spans repos, services, and years of decisions.",
        "A one-off prompt can’t hold architecture, conventions, or ownership.",
        "Shift from 'ask the model' to 'engineer the system around it'.",
      ],
      insight: "At scale, the bottleneck is context window degradation, not the prompt.",
    },
    {
      title: "Building Reusable Claude Workflows (Skills)",
      bullets: [
        "Turn repeated processes into named, versioned workflows (Skills).",
        "Isolate procedures like Git conventions (branch/commit/PR) from daily chat tokens.",
        "Use configuration frontmatter to declare execution safety and model invocation boundaries.",
        "Treat workflows like code: version them, review diffs, maintain changelogs.",
      ],
      insight: "Procedures belong in automated skills, never inline in CLAUDE.md.",
    },
    {
      title: "Durable Experience Memory Systems",
      bullets: [
        "Human-curated learning: you explicitly decide what lessons are worth saving.",
        "Retrieval-first architecture: a lean rule fetches memory only when relevant.",
        "Avoids CLAUDE.md bloat: protects the 200-line limit from context rot.",
        "Mempalace MCP: persist structural data and historical design tokens.",
      ],
      insight: "Build a lightweight search layer over context instead of dumping text into flat files.",
    },

    // ==========================================
    // PART 2: TECHNICAL DEEP DIVE (HUY)
    // ==========================================
    {
      title: "Semantic Codebase Navigation at Scale",
      bullets: [
        "Progressive disclosure: load structure on demand, never the entire repo.",
        "Source Indexer: pre-computes semantic map and architecture hooks.",
        "Source Navigator: drills directly into code without repetitive directory scans.",
        "Tradeoff: enforce a strict depth limit to preserve token budget.",
      ],
      insight: "A two-level context graph beats rewriting prompts or running endless greps.",
    },
    {
      title: "Tiered Sub-Agent Pipelines",
      bullets: [
        "Model routing as policy: match model reasoning capacity to task difficulty.",
        "Phase 1 (Haiku): cheap, rapid discovery and Jira ticket parsing.",
        "Phase 2 (Sonnet): high-intelligence architectural reasoning and planning.",
        "Phase 3 (Sonnet): clean, isolated context window for final execution.",
      ],
      insight: "Isolate context. Later stages inherit distilled summaries, not noisy exploration text.",
    },
    {
      title: "Advanced Orchestration: Fan-Out & Debate",
      bullets: [
        "Parallel Fan-Out: deploy multiple independent sub-agents for concurrent tasks.",
        "Strict boundary condition: tasks must have zero shared state or file conflict risks.",
        "Adversarial Debate: two separate sub-agents argue opposing approaches.",
        "Removes self-preferential bias structurally instead of relying on model self-correction.",
      ],
      insight: "Dynamic workflows script the loop and synthesis steps deterministically.",
    },
    {
      title: "The MCP Ecosystem: Connecting Systems of Record",
      bullets: [
        "Reach outside the filesystem without manual context copy-pasting.",
        "Jira MCP: authoritative context for work-tracking and requirements.",
        "GitHub MCP: live repository access, code reviews, and PR orchestration.",
        "Confluence MCP: automated policy, organizational guardrails, and compliance.",
      ],
      insight: "Tool priority: prefer specialized internal MCPs over generic web searches.",
    },

    // ==========================================
    // PART 3: OPTIMIZATION & WRAP-UP (ANY)
    // ==========================================
    {
      title: "Optimizing Tokens & Ruthless Compression",
      bullets: [
        "Demand compressed, high-signal summaries from sub-agents before injection.",
        "/caveman ultra: max compression — drop politeness, keep signal.",
        "/ponytail ultra: lazy senior dev mode — minimum code, maximum signal, zero ceremony.",
        "Normal: 'I'd be happy to help! The error occurs because the token has expired...'",
        "Ultra: 'Token expired. Fix TTL. Or just delete the feature.'",
      ],
      insight: "Tokens are budget—spend them on complex reasoning, not re-reading conversational fluff.",
    },
    {
      title: "Demo: System Engineering in Action",
      bullets: [
        
      ],
      insight: "The workflow is the product—watch it build itself.",
    },
    {
      title: "Mindset Shift & Key Takeaways",
      bullets: [
        "Isolate context window segments so quality does not degrade over time.",
        "Put the right data in the right layer (CLAUDE.md vs. Skills vs. Rules vs. Memory).",
        "Parallelize tasks aggressively wherever dependencies allow.",
        "Treat Claude as a junior colleague you manage with systems, not prophet.",
      ],
      insight: "Scale comes from the system you build around the model.",
    },
    {
      title: "Questions & Answers",
      bullets: [],
    },
    {
      title: "Thank You for Your Attention",
      bullets: [
        "Slides & resources: github.com/daricvn/claude-in-action-slide-demo",
        "Try Claude Code today: claude.ai/code",
      ]
    },
  ],
};

const vi: Dict = {
  ui: {
    heroEyebrow: "Bài thuyết trình Kỹ thuật Doanh nghiệp",
    heroSubtitle: "Mở rộng quy trình AI cho Kỹ thuật Doanh nghiệp",
    presentedBy: "Trình bày bởi Huy Truong, Darick Nguyen",
    keyInsight: "Điểm mấu chốt: ",
    allSlides: "Tất cả slide",
    slidesJump: (n) => `${n} slide · nhấn để chuyển`,
    watchMempalaceDemo: "Xem demo Mempalace",
    changeLanguage: "Đổi ngôn ngữ",
  },
  slides: [
    {
      title: "Chương trình",
      bullets: [
        "Phần 1 — Nền tảng & Thiết kế Hệ thống",
        "Phần 2 — Kỹ thuật Chuyên sâu & Công cụ",
        "Phần 3 — Tối ưu hóa, Demo & Tổng kết",
      ],
    },
    // ==========================================
    // PHẦN 1: NỀN TẢNG & KIẾN TRÚC NGỮ CẢNH (DARICK)
    // ==========================================
    {
      title: "Tại sao Prompt đơn thuần là chưa đủ ở quy mô Doanh nghiệp",
      bullets: [
        "Prompt không thể mở rộng: mỗi phiên làm việc đều phải bắt đầu từ số 0.",
        "Mã nguồn doanh nghiệp trải dài qua nhiều repo, service và hàng năm lịch sử.",
        "Một prompt đơn lẻ không chứa nổi kiến trúc, quy chuẩn hay quyền sở hữu.",
        "Dịch chuyển tư duy: từ 'hỏi mô hình' sang 'thiết lập hệ thống quanh mô hình'.",
      ],
      insight: "Ở quy mô lớn, nút thắt cổ chai nằm ở ngữ cảnh (context), không phải prompt.",
    },
    {
      title: "Xây dựng Quy trình Claude tái sử dụng (Skills)",
      bullets: [
        "Đóng gói các tác vụ lặp lại thành các quy trình có tên và phiên bản (Skills).",
        "Tách biệt các quy trình như Git convention (branch/commit/PR) khỏi token trò chuyện hàng ngày.",
        "Sử dụng cấu hình frontmatter để kiểm soát quyền thực thi và ranh giới gọi mô hình.",
        "Quản lý quy trình như code: quản lý phiên bản, duyệt diff và cập nhật changelog.",
      ],
      insight: "Quy trình xử lý thuộc về Skill tự động, không nhồi nhét vào CLAUDE.md.",
    },
    {
      title: "Hệ thống lưu trữ Trải nghiệm (Durable Experience Memory)",
      bullets: [
        "Ghi nhận có chọn lọc: chính bạn quyết định bài học nào đáng lưu trữ.",
        "Kiến trúc ưu tiên truy vấn (Retrieval-first): luật tối giản, chỉ nạp bộ nhớ khi cần thiết.",
        "Tránh phình to CLAUDE.md: bảo vệ giới hạn 200 dòng để ngăn suy giảm chất lượng ngữ cảnh.",
        "Mempalace MCP: lưu giữ dữ liệu cấu trúc và các design token xuyên suốt các phiên.",
      ],
      insight: "Xây dựng tầng tìm kiếm mỏng trên ngữ cảnh thay vì ném text vào các file phẳng.",
    },

    // ==========================================
    // PHẦN 2: THỰC THI & CÔNG CỤ SÂU (HUY)
    // ==========================================
    {
      title: "Điều hướng Codebase lớn bằng Semantic Navigation",
      bullets: [
        "Tiết lộ tăng tiến (Progressive disclosure): tải cấu trúc theo nhu cầu, không tải toàn bộ repo.",
        "Source Indexer: tính toán trước bản đồ ngữ nghĩa và các điểm neo kiến trúc.",
        "Source Navigator: đi thẳng vào file code mục tiêu, bỏ qua việc quét thư mục lặp đi lặp lại.",
        "Đánh đổi thiết kế: giới hạn độ sâu (depth limit) nghiêm ngặt để tiết kiệm token.",
      ],
      insight: "Một đồ thị ngữ cảnh hai tầng hiệu quả hơn việc viết lại prompt hay liên tục grep.",
    },
    {
      title: "Định tuyến Sub-Agent phân tầng (Tiered Pipelines)",
      bullets: [
        "Định tuyến mô hình theo chính sách: khớp năng lực tư duy của mô hình với độ khó tác vụ.",
        "Giai đoạn 1 (Haiku): đọc hiểu nhanh, phân tích ticket Jira chi phí thấp.",
        "Giai đoạn 2 (Sonnet): tư duy kiến trúc chuyên sâu và lập kế hoạch xử lý.",
        "Giai đoạn 3 (Sonnet): thực thi mã nguồn trong một cửa sổ ngữ cảnh hoàn toàn sạch.",
      ],
      insight: "Cô lập ngữ cảnh. Giai đoạn sau thừa hưởng tóm tắt tinh gọn, không kế thừa rác thăm dò.",
    },
    {
      title: "Điều phối nâng cao: Fan-Out & Đối biện",
      bullets: [
        "Parallel Fan-Out: triển khai nhiều sub-agent độc lập để xử lý các tác vụ song song.",
        "Điều kiện ranh giới nghiêm ngặt: tác vụ không được tranh chấp file hoặc chung trạng thái.",
        "Tranh luận đối biện (Adversarial Debate): hai sub-agent độc lập bảo vệ hai giải pháp trái ngược.",
        "Loại bỏ định kiến tự thiên vị (self-preferential bias) bằng cấu trúc hệ thống thay vì kỳ vọng mô hình tự sửa.",
      ],
      insight: "Dynamic workflow giúp lập trình sẵn các vòng lặp và bước tổng hợp một cách nhất quán.",
    },
    {
      title: "Hệ sinh thái MCP: Kết nối các Hệ thống dữ liệu gốc",
      bullets: [
        "Mở rộng không gian làm việc ngoài filesystem mà không cần copy-paste thủ công.",
        "Jira MCP: nguồn dữ liệu gốc để theo dõi công việc và yêu cầu nghiệp vụ.",
        "GitHub MCP: truy cập trực tiếp repo, duyệt mã nguồn và điều phối PR.",
        "Confluence MCP: tự động hóa việc áp dụng chính sách, rào chắn tổ chức và tuân thủ.",
      ],
      insight: "Ưu tiên công cụ: chọn các MCP nội bộ chuyên dụng thay vì tìm kiếm web chung chung.",
    },

    // ==========================================
    // PHẦN 3: TỐI ƯU & ĐÚC KẾT (ANY)
    // ==========================================
    {
      title: "Tối ưu hóa Token & Nén dữ liệu cực đoan",
      bullets: [
        "Yêu cầu sub-agent trả về tóm tắt cô đọng trước khi nạp lại vào luồng chính.",
        "/caveman ultra: nén tối đa — bỏ lễ nghi, giữ tín hiệu.",
        "/ponytail ultra: chế độ senior lười biếng — ít code nhất, tín hiệu cao nhất, không lễ nghi.",
        "Thông thường: 'Tôi rất vui được trợ giúp! Lỗi này xảy ra do token đã hết hạn...'",
        "Ultra: 'Token hết hạn. Sửa TTL. Hoặc xóa tính năng đó đi.'",
      ],
      insight: "Token là ngân sách—hãy tiêu vào tư duy logic, đừng tiêu vào việc đọc lại lời thừa.",
    },
    {
      title: "Demo: Kỹ nghệ Hệ thống trong Thực tế",
      bullets: [
       
      ],
      insight: "Quy trình chính là sản phẩm—hãy xem nó tự vận hành và xây dựng.",
    },
    {
      title: "Thay đổi Tư duy & bài học rút ra",
      bullets: [
        "Cô lập các phân đoạn ngữ cảnh để chất lượng phản hồi không bị suy giảm theo thời gian.",
        "Đặt đúng dữ liệu vào đúng tầng kiến trúc (CLAUDE.md vs. Skills vs. Rules vs. Memory).",
        "Song song hóa tác vụ triệt để bất cứ khi nào các ràng buộc phụ thuộc cho phép.",
        "Coi Claude như một cộng sự cấp dưới cần quản lý bằng hệ thống, không phải là nhà tiên tri vũ trụ.",
      ],
      insight: "Khả năng mở rộng đến từ hệ thống bạn xây dựng xung quanh mô hình.",
    },
    {
      title: "Hỏi & Đáp",
      bullets: [],
    },
    {
      title: "Cảm ơn bạn đã chú ý lắng nghe",
      bullets: [
        "Slide & tài nguyên: github.com/daricvn/claude-in-action-slide-demo",
        "Dùng thử Claude Code: claude.ai/code",
      ]
    },
  ],
};

const DICTS: Record<Locale, Dict> = { en, vi };

/** Reactive accessor for the active dictionary. Read inside JSX. */
export const t = () => DICTS[locale()];
