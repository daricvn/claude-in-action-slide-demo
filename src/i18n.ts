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
      title: "Why Enterprise-Scale AI Assistance Needs More Than Prompts",
      bullets: [
        "Prompts don’t scale: every session restarts from zero context.",
        "Enterprise code spans repos, services, and years of decisions.",
        "A one-off prompt can’t hold architecture, conventions, or ownership.",
        "You need durable context, reusable workflows, and bounded agents.",
        'Shift from "ask the model" to "engineer the system around it".',
      ],
      insight: "At scale, the bottleneck is context, not the prompt.",
    },
    {
      title: "Building Reusable Claude Workflows for Large Projects",
      bullets: [
        "Turn repeated prompts into named, versioned workflows (Skills)",
        "Structure phases clearly: Investigate → Plan → Implement → Verify",
        "Encode team standards once in the workflow, not in every message",
        "Make workflows adaptive — let them branch based on findings",
        "Treat workflows like code: version them, review diffs, maintain changelog",
      ],
      insight:
        "A reusable workflow beats rewriting prompts. Try Caveman + NeoLabHQ/context-engineering-kit.",
    },
    {
      title: "Investigating Multi-Repo Systems Effectively",
      bullets: [
        "Start from north-star files: ARCHITECTURE.md, README, configs.",
        "Keep a workspace manifest: repos, owners, and entry points.",
        "Resolve cross-repo contracts — APIs, schemas, events — first.",
        "Trace one real request end-to-end across services to ground reality.",
        "Map service boundaries and data flow before touching a line.",
      ],
      insight: "In multi-repo, the contract is the codebase.",
    },
    {
      title: "Using Sub-Agents for Dynamic Task Orchestration",
      bullets: [
        "Decompose by boundary: one agent per service, layer, or repo",
        "Give each a narrow scope and clear success criteria",
        "Run investigators in parallel, serialize writers",
        "Pass distilled summaries up, never raw output",
        "Always verify 'done' yourself — never fully trust",
      ],
      insight:
        "Well-bounded sub-agents multiply power. Loose ones create chaos and explode token usage.",
    },
    {
      title: "Organizing Context: Files, Workflows, Rules & Memory",
      bullets: [
        "ARCHITECTURE.md — one map of boundaries, data flow, and decisions.",
        "CLAUDE.md — always-on router: keep it lean, link don’t inline.",
        "Workflows — invokable, reusable procedures with their own docs.",
        "Rules & hooks — automated enforcement the harness runs, not you.",
        "Memory MCP (mempalace) — persist the *why* across sessions.",
      ],
      insight: "Context engineering is the real interface to the model.",
    },
    {
      title: "Optimizing Tokens & Avoiding Context Bloat",
      bullets: [
        "Demand distilled answers, never raw dumps",
        "Search narrowly — load only the needed slice",
        "Compress sub-agent outputs before re-injecting",
        "Cache stable facts in Mempalace",
        "Master Caveman workflow: terse, high-signal output",
      ],
      insight: "Tokens are budget — spend them on reasoning, not re-reading.",
    },
    {
      title: "Demo: AI Web Slide — Workflow in Action",
      bullets: [
        "This slide was built by using workflows.",
        "Workflows + sub-agents scaffolded slides, layout, and animation.",
        "Memory MCP held design tokens and architecture across sessions.",
        "Watch the loop run live: investigate → plan → implement → verify.",
        "The same pattern scales from a slide deck to an enterprise monorepo.",
      ],
      insight: "The workflow is the product — watch it build itself.",
    },
    {
      title: "Mindset Shift & Key Takeaways",
      bullets: [
        "Engineer the system around Claude, not just prompt it",
        "Build reusable workflows instead of one-off prompts",
        "Master context: ARCHITECTURE.md, CLAUDE.md, Workflows & Mempalace",
        "Use bounded sub-agents + ruthless token optimization",
        "Treat Claude as a junior colleague you manage, not magic",
      ],
      insight: "Scale comes from the system you build around the model.",
    },
    {
      title: "Fun to Know",
      bullets: [
        '/caveman ultra — max compression. Normal: "I\'d be happy to help! The error likely occurs because the token has expired and…" → Ultra: "Token expired. Fix TTL."',
        "Cavecrew — dynamic specialist sub-agents: builder, investigator, reviewer.",
        "NeoLabHQ/context-engineering-kit — architecture, TDD & brainstorming templates.",
        '"Hack" Opus: inject Fable 5 system prompt to unlock its full reasoning — https://github.com/sgup/ai/blob/main/Fable5.md',
      ],
      insight: "The ecosystem around Claude moves fast — stay curious.",
    },
    {
      title: "Questions & Answers",
      bullets: [],
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
      title: "Vì sao Trợ lý AI quy mô Doanh nghiệp cần nhiều hơn Prompt",
      bullets: [
        "Prompt không mở rộng được: mỗi phiên bắt đầu lại từ con số không.",
        "Mã nguồn doanh nghiệp trải khắp nhiều repo, dịch vụ và nhiều năm quyết định.",
        "Một prompt đơn lẻ không thể nắm giữ kiến trúc, quy ước hay quyền sở hữu.",
        "Bạn cần ngữ cảnh bền vững, workflows và agent có giới hạn.",
        'Chuyển từ "hỏi mô hình" sang "xây dựng hệ thống quanh nó".',
      ],
      insight: "Ở quy mô lớn, nút thắt là ngữ cảnh, không phải prompt.",
    },
    {
      title: "Xây dựng Workflows cho Claude trong Dự án Lớn",
      bullets: [
        "Biến prompt lặp lại thành Workflows có tên và phiên bản",
        "Phân chia giai đoạn rõ ràng: Khảo sát → Lập kế hoạch → Triển khai → Kiểm chứng",
        "Mã hóa tiêu chuẩn nhóm một lần trong workflow, không phải mỗi tin nhắn",
        "Làm workflow linh hoạt — cho phép rẽ nhánh theo phát hiện",
        "Đối xử với workflow như mã: đánh phiên bản, soát diff, duy trì changelog",
      ],
      insight:
        "Workflows hơn hẳn viết lại prompt. Thử Caveman + NeoLabHQ/context-engineering-kit.",
    },
    {
      title: "Khảo sát Hệ thống Đa-Repo Hiệu quả",
      bullets: [
        "Bắt đầu từ các file định hướng: ARCHITECTURE.md, README, cấu hình.",
        "Giữ một bản kê workspace: repo, chủ sở hữu và điểm vào.",
        "Giải quyết hợp đồng liên-repo — API, schema, sự kiện — trước tiên.",
        "Lần theo một request thật xuyên suốt các dịch vụ để bám sát thực tế.",
        "Vẽ ranh giới dịch vụ và luồng dữ liệu trước khi chạm một dòng mã.",
      ],
      insight: "Trong đa-repo, hợp đồng chính là mã nguồn.",
    },
    {
      title: "Dùng Sub-Agent để Điều phối Tác vụ Linh hoạt",
      bullets: [
        "Phân rã theo ranh giới: mỗi agent một dịch vụ, tầng hoặc repo",
        "Cho mỗi agent phạm vi hẹp và tiêu chí thành công rõ ràng",
        "Chạy khảo sát song song, ghi tuần tự",
        "Truyền lên bản tóm tắt cô đọng, không bao giờ là kết quả thô",
        "Luôn tự kiểm chứng 'đã xong' — đừng tin tuyệt đối",
      ],
      insight:
        "Sub-agent có giới hạn tốt nhân lên sức mạnh. Lỏng lẻo thì gây hỗn loạn và bùng nổ token.",
    },
    {
      title: "Tổ chức Ngữ cảnh: File, Workflows, Rule & Memory",
      bullets: [
        "ARCHITECTURE.md — một bản đồ ranh giới, luồng dữ liệu và quyết định.",
        "CLAUDE.md — bộ định tuyến luôn bật: giữ gọn, liên kết thay vì nhúng.",
        "Workflows — thủ tục gọi được, tái sử dụng, có tài liệu riêng.",
        "Rule & hook — thực thi tự động do harness chạy, không phải bạn.",
        "Memory MCP (mempalace) — lưu giữ *lý do* xuyên suốt các phiên.",
      ],
      insight: "Kỹ thuật ngữ cảnh mới là giao diện thật sự với mô hình.",
    },
    {
      title: "Tối ưu Token & Tránh Phình Ngữ cảnh",
      bullets: [
        "Yêu cầu câu trả lời cô đọng, không phải đổ dữ liệu thô",
        "Tìm kiếm hẹp — chỉ nạp phần cần thiết",
        "Nén kết quả sub-agent trước khi đưa lại vào",
        "Lưu các dữ kiện ổn định trong Mempalace",
        "Thành thạo Caveman Workflow: đầu ra ngắn gọn, cô đọng",
      ],
      insight: "Token là ngân sách — hãy chi cho suy luận, không phải đọc lại.",
    },
    {
      title: "Demo: Slide Web AI — Quy trình Trong Thực tế",
      bullets: [
        "Bộ slide này được dựng bằng các Workflows dựng sẵn.",
        "Workflows + sub-agent dựng khung slide, bố cục và hoạt ảnh.",
        "Memory MCP giữ design token và kiến trúc xuyên các phiên.",
        "Xem vòng lặp chạy trực tiếp: khảo sát → lập kế hoạch → triển khai → kiểm chứng.",
        "Cùng mô thức mở rộng từ bộ slide đến monorepo doanh nghiệp.",
      ],
      insight: "Quy trình chính là sản phẩm — xem nó tự dựng nên mình.",
    },
    {
      title: "Chuyển đổi Tư duy & Điểm Cốt lõi",
      bullets: [
        "Xây hệ thống quanh Claude, không chỉ ra lệnh thô",
        "Dựng workflows thay vì prompt dùng một lần",
        "Làm chủ ngữ cảnh: ARCHITECTURE.md, CLAUDE.md, Workflows & Mempalace",
        "Dùng sub-agent có giới hạn + tối ưu token triệt để",
        "Xem Claude như đồng nghiệp mới vào nghề bạn quản lý, không phải phép màu",
      ],
      insight: "Quy mô đến từ hệ thống bạn xây quanh mô hình.",
    },
    {
      title: "Thú vị để Biết",
      bullets: [
        '/caveman ultra — cục súc tối đa. Thường: "Rất sẵn lòng giúp! Lỗi có lẽ do token đã hết hạn và…" → Ultra: "Token hết hạn. Sửa TTL."',
        "Cavecrew — dynamic sub-agent chuyên biệt: builder, investigator, reviewer.",
        "NeoLabHQ/context-engineering-kit — mẫu kiến trúc, TDD & brainstorm.",
        '"Hack" Opus: tiêm system prompt Fable 5 để mở khóa toàn bộ khả năng suy luận — https://github.com/sgup/ai/blob/main/Fable5.md',
      ],
      insight: "Hệ sinh thái quanh Claude đổi thay nhanh — hãy luôn tò mò.",
    },
    {
      title: "Hỏi & Đáp",
      bullets: [],
    },
  ],
};

const DICTS: Record<Locale, Dict> = { en, vi };

/** Reactive accessor for the active dictionary. Read inside JSX. */
export const t = () => DICTS[locale()];
