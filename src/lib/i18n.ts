// 国际化配置和翻译数据
export type Language = 'en' | 'zh';

export interface TranslationData {
  // 导航栏
  nav: {
    home: string;
    products: string;
    about: string;
    contact: string;
    pricing: string;
  };
  
  // 主页标题和描述
  hero: {
    title: string;
    subtitle: string;
    description: string;
    getStarted: string;
    learnMore: string;
    trustedBy: string;
  };
  
  // 功能特性卡片
  features: {
    card1: {
      title: string;
      description: string;
      detail: string;
    };
    card2: {
      title: string;
      description: string;
      detail: string;
    };
    card3: {
      title: string;
      description: string;
      detail: string;
    };
    card4: {
      title: string;
      description: string;
      detail: string;
    };
    card5: {
      title: string;
      description: string;
      detail: string;
    };
  };
  
  // 对比部分
  comparison: {
    title: string;
    subtitle: string;
    aiAgent: {
      title: string;
      steps: string;
      stepList: string[];
    };
    consultant: {
      title: string;
      steps: string;
      stepList: string[];
    };
    traditional: {
      title: string;
      steps: string;
      stepList: string[];
    };
  };
  
  // 联系表单
  contact: {
    title: string;
    subtitle: string;
    description: string;
    form: {
      name: string;
      email: string;
      phone: string;
      company: string;
      message: string;
      submit: string;
      submitting: string;
      placeholder: {
        name: string;
        email: string;
        phone: string;
        company: string;
        message: string;
      };
    };
    messages: {
      success: string;
      error: string;
      validation: string;
    };
  };
  
  // 页脚
  footer: {
    description: string;
    quickLinks: string;
    contact: string;
    followUs: string;
    copyright: string;
  };
  
  // 其他页面
  pages: {
    about: {
      title: string;
      content: string;
    };
    products: {
      title: string;
      content: string;
    };
    pricing: {
      title: string;
      content: string;
    };
  };
}

// 英文翻译
export const translations: Record<Language, TranslationData> = {
  en: {
    nav: {
      home: 'Home',
      products: 'Products',
      about: 'About',
      contact: 'Contact',
      pricing: 'Pricing'
    },
    hero: {
      title: 'Climate Seal',
      subtitle: 'AI-Powered Carbon Accounting',
      description: 'Transform your sustainability journey with intelligent carbon footprint analysis and reporting.',
      getStarted: 'Get Started',
      learnMore: 'Learn More',
      trustedBy: 'Trusted by'
    },
    features: {
      card1: {
        title: 'Auto Regulation Match & LCA Build',
        description: 'Enter a product name and sales region, and the engine fetches the newest EU Battery Regulation 2023/1542 and ISO 14067 requirements, then spins up a compliant boundary and base LCA in 30 seconds.',
        detail: 'Eliminates 90% of regulatory research effort and ships a multi-standard-ready model that sails through audits and customer reviews.'
      },
      card2: {
        title: 'BOM Parsing in Seconds',
        description: 'Drop an Excel or ERP BOM and the system instantly extracts hierarchy, quantities and materials—no line-by-line typing.',
        detail: 'Thousands-part assemblies become calculation-ready in minutes, and engineering, finance and carbon teams work off the same structured table.'
      },
      card3: {
        title: 'Smart Emission-Factor Matching',
        description: 'The engine live-matches BOM lines, energy and logistics data against ecoinvent and other libraries, returning the optimal factor, provenance',
        detail: 'Cuts weeks of manual lookup, while fully traceable factors pass audits or customer spot-checks instantly.'
      },
      card4: {
        title: 'Quality & Risk Analytics',
        description: 'One click builds a data-quality radar, a ±95% Monte-Carlo band, and a heat-map that flags high-impact, low-quality items—then rolls up an overall trust score.',
        detail: 'Teams see the critical 20% of inputs that drive 80% of uncertainty, and quantified CIs give investors, auditors and insurers a solid risk metric.'
      },
      card5: {
        title: 'End-to-End Custom Service',
        description: 'The supply-chain module bulk-invites Tier-2/3 suppliers, lets AI auto-calculate their footprints, and syncs bidirectionally with SAP Green Ledger, Oracle NetSuite and other ERP/SRM suites. Credit-scored, high-quality data can be packaged into carbon assets and linked to finance partners.',
        detail: 'Suppliers create audit-grade reports at just 1% of the usual time and cost, sharing only final numbers to stay secure; brands obtain high-trust results and cut supply-chain carbon-management costs by 90%+. Credit-approved data can be monetised as carbon assets or collateral for green loans, unlocking climate value early.'
      }
    },
    comparison: {
      title: 'Why Choose Climate Seal AI?',
      subtitle: 'Compare traditional approaches with our AI-powered solution',
      aiAgent: {
        title: 'AI Agent',
        steps: '4 STEPS',
        stepList: ['① Minimal Data', '② Confirm', '③ Send to Verifier', '④ Certification']
      },
      consultant: {
        title: 'Third Party Carbon Consultant + Carbon Accounting Software',
        steps: '11 STEPS',
        stepList: ['① Training', '② Doc + Reg Map', '③ Data Checklist', '④ Data Clean', '⑤ Gap Fill', '⑥ Build Model', '⑦ Factor Match', '⑧ Submit', '⑨ Issue List', '⑩ Corrections', '⑪ Certification']
      },
      traditional: {
        title: 'Carbon Consultant',
        steps: '12 STEPS',
        stepList: ['① Kick-Off', '② Info Search', '③ Data Prep', '④ Clean + Interview', '⑤ Calc Model', '⑥ Factor Calc', '⑦ Draft Report', '⑧ Review', '⑨ Submit to Verifier', '⑩ Issue Feedback', '⑪ Info Correction', '⑫ Certification']
      }
    },
    contact: {
      title: 'Contact Us',
      subtitle: 'Ready to start your carbon neutral journey? Our expert team is here to support you',
      description: 'Get in touch with our team',
      form: {
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        company: 'Company Name',
        message: 'Message',
        submit: 'Send Message',
        submitting: 'Sending...',
        placeholder: {
          name: 'Please enter your name',
          email: 'Please enter your email',
          phone: 'Please enter your phone number',
          company: 'Please enter company name',
          message: 'Please describe your needs or questions'
        }
      },
      messages: {
        success: 'Message sent successfully! We will reply to you soon.',
        error: 'Send failed, please try again later or send email directly to xuguang.ma@climateseal.net',
        validation: 'Please fill in all required fields'
      }
    },
    footer: {
      description: 'AI-powered carbon accounting platform for sustainable business solutions.',
      quickLinks: 'Quick Links',
      contact: 'Contact',
      followUs: 'Follow Us',
      copyright: '© 2024 Climate Seal. All rights reserved.'
    },
    pages: {
      about: {
        title: 'About Climate Seal',
        content: 'About page content is under construction...'
      },
      products: {
        title: 'Our Products',
        content: 'Products page content is under construction...'
      },
      pricing: {
        title: 'Pricing Plans',
        content: 'Pricing page content is under construction...'
      }
    }
  },
  
  // 中文翻译
  zh: {
    nav: {
      home: '首页',
      products: '产品',
      about: '关于我们',
      contact: '联系我们',
      pricing: '价格'
    },
    hero: {
      title: 'Climate Seal',
      subtitle: 'AI驱动的碳核算',
      description: '通过智能碳足迹分析和报告，转型您的可持续发展之旅。',
      getStarted: '开始使用',
      learnMore: '了解更多',
      trustedBy: '信赖我们的客户'
    },
    features: {
      card1: {
        title: '自动法规匹配与LCA构建',
        description: '输入产品名称和销售地区，引擎获取最新的EU电池法规2023/1542和ISO 14067要求，然后在30秒内生成合规边界和基础LCA。',
        detail: '消除90%的法规研究工作量，提供多标准就绪模型，轻松通过审计和客户审查。'
      },
      card2: {
        title: 'BOM秒级解析',
        description: '拖放Excel或ERP BOM，系统立即提取层次结构、数量和材料——无需逐行输入。',
        detail: '数千零件的装配在几分钟内即可准备计算，工程、财务和碳排放团队可基于同一结构化表格工作。'
      },
      card3: {
        title: '智能排放因子匹配',
        description: '引擎实时匹配BOM行项、能源和物流数据与ecoinvent等数据库，返回最优因子和来源。',
        detail: '节省数周的手动查找时间，完全可追溯的因子可即时通过审计或客户抽查。'
      },
      card4: {
        title: '质量与风险分析',
        description: '一键构建数据质量雷达图、±95%蒙特卡洛区间和热力图，标记高影响、低质量项目——汇总整体信任评分。',
        detail: '团队可看到驱动80%不确定性的关键20%输入，量化的置信区间为投资者、审计师和保险公司提供可靠的风险指标。'
      },
      card5: {
        title: '端到端定制服务',
        description: '供应链模块批量邀请2/3级供应商，让AI自动计算其碳足迹，并与SAP Green Ledger、Oracle NetSuite等ERP/SRM套件双向同步。经信用评分的高质量数据可打包为碳资产并关联金融合作伙伴。',
        detail: '供应商能以通常成本的1%创建审计级报告，只共享最终数字以保持安全；品牌获得高信任度结果并将供应链碳管理成本削减90%+。经信贷审核的数据可货币化为碳资产或绿色贷款抵押品，提前释放气候价值。'
      }
    },
    comparison: {
      title: '为什么选择Climate Seal AI？',
      subtitle: '传统方法与我们AI驱动解决方案的对比',
      aiAgent: {
        title: 'AI智能体',
        steps: '4步骤',
        stepList: ['① 最少数据', '② 确认', '③ 发送验证方', '④ 认证']
      },
      consultant: {
        title: '第三方碳顾问 + 碳核算软件',
        steps: '11步骤',
        stepList: ['① 培训', '② 文档+法规映射', '③ 数据清单', '④ 数据清理', '⑤ 填补空缺', '⑥ 构建模型', '⑦ 因子匹配', '⑧ 提交', '⑨ 问题清单', '⑩ 修正', '⑪ 认证']
      },
      traditional: {
        title: '碳顾问',
        steps: '12步骤',
        stepList: ['① 启动', '② 信息搜索', '③ 数据准备', '④ 清理+访谈', '⑤ 计算模型', '⑥ 因子计算', '⑦ 报告草案', '⑧ 审查', '⑨ 提交验证方', '⑩ 问题反馈', '⑪ 信息修正', '⑫ 认证']
      }
    },
    contact: {
      title: '联系我们',
      subtitle: '准备开始您的碳中和之旅？我们的专家团队随时为您提供支持',
      description: '联系我们的团队',
      form: {
        name: '姓名',
        email: '邮箱',
        phone: '电话',
        company: '公司名称',
        message: '留言',
        submit: '发送消息',
        submitting: '发送中...',
        placeholder: {
          name: '请输入您的姓名',
          email: '请输入您的邮箱',
          phone: '请输入您的电话号码',
          company: '请输入公司名称',
          message: '请描述您的需求或问题'
        }
      },
      messages: {
        success: '消息发送成功！我们会尽快回复您。',
        error: '发送失败，请稍后重试或直接发送邮件至 xuguang.ma@climateseal.net',
        validation: '请填写所有必需字段'
      }
    },
    footer: {
      description: 'AI驱动的碳核算平台，为可持续商业解决方案提供支持。',
      quickLinks: '快速链接',
      contact: '联系方式',
      followUs: '关注我们',
      copyright: '© 2024 Climate Seal. 保留所有权利。'
    },
    pages: {
      about: {
        title: '关于Climate Seal',
        content: '关于页面内容正在建设中...'
      },
      products: {
        title: '我们的产品',
        content: '产品页面内容正在建设中...'
      },
      pricing: {
        title: '价格方案',
        content: '价格页面内容正在建设中...'
      }
    }
  }
};

// 默认语言
export const DEFAULT_LANGUAGE: Language = 'en';