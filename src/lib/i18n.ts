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
    login: string;
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

  // 页面部分
  sections: {
    whatWeDo: {
      title: string;
      subtitle: string;
      scrollingText1: string;
      scrollingText2: string;
    };
    scenarios: {
      title: string;
      whyNeed: {
        title: string;
        export: {
          title: string;
          description: string;
        };
        procurement: {
          title: string;
          description: string;
        };
        government: {
          title: string;
          description: string;
        };
      };
      painPoints: {
        title: string;
        highBarrier: {
          title: string;
          description: string;
        };
        highCost: {
          title: string;
          description: string;
        };
        longCycle: {
          title: string;
          description: string;
        };
        supplyChainPressure: {
          title: string;
          description: string;
        };
        hiddenCost: {
          title: string;
          description: string;
        };
      };
      ourSolution: {
        title: string;
        zeroBarrier: {
          title: string;
          description: string;
        };
        lowCost: {
          title: string;
          description: string;
        };
        preValidation: {
          title: string;
          description: string;
        };
      };
    };
    comparison: {
      title: string;
      subtitle: string;
    };
    valueForUser: {
      title: string;
      subtitle: string;
    };
    aboutUs: {
      title: string;
      subtitle1: string;
      subtitle2: string;
      subtitle3: string;
      highlightText: string;
    };
    pricing: {
      title: string;
      subtitle: string;
      plans: {
        free: {
          title: string;
          price: string;
          features: string[];
          button: string;
        };
        standard: {
          title: string;
          price: string;
          popular: string;
          features: string[];
          button: string;
        };
        enterprise: {
          title: string;
          price: string;
          features: string[];
          button: string;
        };
      };
    };
    value: {
      cards: {
        cost: {
          title: string;
          subtitle: string;
          description: string;
        };
        time: {
          title: string;
          subtitle: string;
          description: string;
        };
        barrier: {
          title: string;
          subtitle: string;
          description: string;
        };
        trusted: {
          title: string;
          subtitle: string;
          description: string;
        };
      };
    };
    moreInfo: string;
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
      industry: string;
      message: string;
      submit: string;
      submitting: string;
      placeholder: {
        name: string;
        email: string;
        phone: string;
        company: string;
        industry: string;
        message: string;
      };
      industries: {
        automotive: string;
        electronics: string;
        textiles: string;
        chemicals: string;
        foodBeverage: string;
        construction: string;
        metals: string;
        plastics: string;
        packaging: string;
        pharmaceuticals: string;
        energy: string;
        manufacturing: string;
        furniture: string;
        cosmetics: string;
        toys: string;
        agriculture: string;
        transportation: string;
        retail: string;
        other: string;
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
      pricing: 'Pricing',
      login: 'login'
    },
    hero: {
      title: 'Climate Seal',
      subtitle: 'Product Carbon Footprint\nAI Agent',
      description: 'Get a credible carbon footprint at 1% of the cost and time',
      getStarted: 'Try Now (2 Free Reports)',
      learnMore: 'Learn More',
      trustedBy: 'Trusted by'
    },

    sections: {
      whatWeDo: {
        title: 'What We Do',
        subtitle: 'Get a credible carbon footprint at 1% of the cost and time',
        scrollingText1: 'Gain Credibility At Low Cost',
        scrollingText2: 'Use Credit At Low Cost'
      },
      scenarios: {
        title: 'Scenarios & Value',
        whyNeed: {
          title: 'Why Do You Need Product Carbon Footprint (PCF)?',
          export: {
            title: 'Export',
            description: 'CBAM default values are costly\nESPR/DPP: Multiple categories require "product passports"\nDisclosure: Rough disclosure faces passive verification (satellite)\nBattery-related: "Product-level carbon footprint + electronic passport"'
          },
          procurement: {
            title: 'Procurement/Green Supply Chain',
            description: 'Brands: SBTi requires 67% Scope 3 coverage\nBrands: Carbon performance written into supplier terms\nSupply chain pressure: High data quality requirements, high costs, poor carbon foundation'
          },
          government: {
            title: 'Government Green Procurement & Green Building EPD',
            description: 'Government green procurement: Cannot participate without PCF/LCA\nEngineering/Building materials: Cannot bid or lose points without EPD'
          }
        },
        painPoints: {
          title: 'Pain Points in Completing Product Carbon Footprint (PCF)',
          highBarrier: {
            title: 'High Barrier',
            description: 'Requires carbon experts who understand both methodology and delivery\nMany carbon regulations and standards'
          },
          highCost: {
            title: 'High Cost',
            description: 'PCF or LCA reports require tens of thousands of dollars'
          },
          longCycle: {
            title: 'Long Cycle',
            description: 'PCF takes 1-3 months / EPD takes 3-6 months'
          },
          supplyChainPressure: {
            title: 'High Supply Chain Pressure',
            description: 'Supply chain companies have poor carbon foundation, poor data quality, high costs\nBrands have high carbon management costs'
          },
          hiddenCost: {
            title: 'Hidden Costs',
            description: 'CBAM default values are costly\nPCF missing items rejected by verification agencies for rework'
          }
        },
        ourSolution: {
          title: 'What we are offering?\nOur Solution',
          zeroBarrier: {
            title: 'Zero Barrier',
            description: 'Expert-level guidance\nNo professional background required'
          },
          lowCost: {
            title: 'Cost (Hundreds) / Cycle (Hours)',
            description: '99% reduction'
          },
          preValidation: {
            title: 'Expert "Pre-validation"',
            description: 'Reject rework & hidden costs'
          }
        }
      },
      comparison: {
        title: 'Compare With Traditional Way',
        subtitle: 'Why Choose Climate Seal AI?'
      },
      valueForUser: {
        title: 'Value For User And Enterprise',
        subtitle: 'Choose the right plan to start your carbon footprint journey'
      },
      aboutUs: {
        title: 'About Us',
        subtitle1: 'Gain Credibility At Low Cost',
        subtitle2: 'Use Credit At Low Cost',
        subtitle3: 'Leave More Time And Budget To',
        highlightText: 'Decarbonization'
      },
      pricing: {
        title: 'Pricing Plans',
        subtitle: 'Choose the right plan to start your carbon footprint journey',
        plans: {
          free: {
            title: 'Free Version',
            price: '$0',
            features: ['50 free matching/month', 'Registration required'],
            button: 'Get Started'
          },
          standard: {
            title: 'Standard Version',
            price: '$98',
            popular: 'Popular',
            features: ['200 matching/month', '3-5 reports equivalent'],
            button: 'Upgrade Now'
          },
          enterprise: {
            title: 'Enterprise',
            price: 'Custom',
            features: ['ERP/CRM integration', 'Supply chain mgmt'],
            button: 'Contact Sales'
          }
        }
      },
      value: {
        cards: {
          cost: {
            title: '1% Cost',
            subtitle: 'Cost Reduce',
            description: 'Less Than $70 Per Credible Report'
          },
          time: {
            title: 'Hours',
            subtitle: 'Time Saving',
            description: 'From Months To Hours'
          },
          barrier: {
            title: 'Zero Barrier',
            subtitle: 'Zero Experience Requirement',
            description: 'Any Role Can Create Credible Result'
          },
          trusted: {
            title: 'Trusted',
            subtitle: 'Verification Level Credibility',
            description: 'Virtual Certification Consultant'
          }
        }
      },
      moreInfo: 'Get More Information'
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
        steps: '4\nSTEPS',
        stepList: ['① Minimal Data', '② Confirm', '③ Send to Verifier', '④ Certification']
      },
      consultant: {
        title: 'Third Party Carbon Consultant + Carbon Accounting Software',
        steps: '11\nSTEPS',
        stepList: ['① Training', '② Doc + Reg Map', '③ Data Checklist', '④ Data Clean', '⑤ Gap Fill', '⑥ Build Model', '⑦ Factor Match', '⑧ Submit', '⑨ Issue List', '⑩ Corrections', '⑪ Certification']
      },
      traditional: {
        title: 'Third Party Carbon Consultant',
        steps: '12\nSTEPS',
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
        industry: 'Industry',
        message: 'Message',
        submit: 'Send Message',
        submitting: 'Sending...',
        placeholder: {
          name: 'Please enter your name',
          email: 'Please enter your email',
          phone: 'Please enter your phone number',
          company: 'Please enter company name',
          industry: 'Please select your industry',
          message: 'Please describe your needs or questions'
        },
        industries: {
          automotive: 'Automotive Manufacturing',
          electronics: 'Electronics & Electrical',
          textiles: 'Textiles & Apparel',
          chemicals: 'Chemicals & Chemical Engineering',
          foodBeverage: 'Food & Beverage',
          construction: 'Construction & Building Materials',
          metals: 'Steel & Metals',
          plastics: 'Plastics & Rubber',
          packaging: 'Packaging & Printing',
          pharmaceuticals: 'Pharmaceuticals & Medical',
          energy: 'Energy & Power',
          manufacturing: 'Mechanical Manufacturing',
          furniture: 'Furniture & Home',
          cosmetics: 'Cosmetics & Personal Care',
          toys: 'Toys & Consumer Goods',
          agriculture: 'Agriculture & Food',
          transportation: 'Transportation & Logistics',
          retail: 'Retail & Trade',
          other: 'Other'
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
      pricing: '价格',
      login: '登录'
    },
    hero: {
      title: 'Climate Seal',
      subtitle: 'Product Carbon Footprint\nAI Agent',
      description: '以1%的成本和时间获得可信的碳足迹',
      getStarted: '试用（2个免费报告）',
      learnMore: '了解更多',
      trustedBy: '信赖我们的客户'
    },

    sections: {
      whatWeDo: {
        title: '我们的服务',
        subtitle: '以1%的成本和时间获得可信的碳足迹',
        scrollingText1: 'Gain Credibility At Low Cost',
        scrollingText2: 'Use Credit At Low Cost'
      },
      scenarios: {
        title: '场景与价值',
        whyNeed: {
          title: '为什么需要产品碳足迹CPF？',
          export: {
            title: '出口',
            description: 'CBAM 采用默认值成本高\nESPR/DPP: 多品类要"产品护照"\n以披露: 粗披露遭遇被动核查(卫星)\n电池相关: "产品级碳足迹+电子护照"'
          },
          procurement: {
            title: '采购/绿色供应链',
            description: '品牌方: SBTi要覆盖67%Scope 3\n品牌方: 碳表现写进供方条款\n供应链压力: 数据质量要求高、成本高、碳基础差'
          },
          government: {
            title: '政府绿色采购 & 绿建EPD',
            description: '政府绿色采购：无PCF/LCA不能参与\n工程/建材：无EPD不能投标或减分'
          }
        },
        painPoints: {
          title: '完成产品碳足迹CPF过程中的痛点',
          highBarrier: {
            title: '门槛高',
            description: '需要懂方法+懂交付的碳专家参与\n碳法规和标准多'
          },
          highCost: {
            title: '成本高',
            description: 'PCF或LCA报告需要数万美金'
          },
          longCycle: {
            title: '周期长',
            description: 'PCF1-3个月/EPD 需要 3-6个月'
          },
          supplyChainPressure: {
            title: '供应链压力大',
            description: '供应链企业碳基础差、数据质量差、成本高\n品牌方碳管理成本高'
          },
          hiddenCost: {
            title: '隐形成本',
            description: 'CBAM用默认值成本高\nPCF缺项被核验机构打回返工'
          }
        },
        ourSolution: {
          title: '我们能为您提供什么？\n我们提供的方案',
          zeroBarrier: {
            title: '0门槛',
            description: '专家级碳顾问和认证顾问全程引导/无需专业背景'
          },
          lowCost: {
            title: '成本(百元) / 周期(小时)',
            description: '99%'
          },
          preValidation: {
            title: '专家级"预核验"',
            description: '拒绝返工/隐形成本'
          }
        }
      },
      comparison: {
        title: '与传统方式对比',
        subtitle: '为什么选择Climate Seal AI？'
      },
      valueForUser: {
        title: '用户与企业价值',
        subtitle: '选择合适的方案开始您的碳足迹之旅'
      },
      aboutUs: {
        title: '关于我们',
        subtitle1: '低成本获得可信度',
        subtitle2: '低成本使用信用',
        subtitle3: '留出更多时间和预算用于',
        highlightText: '脱碳化'
      },
      pricing: {
        title: '价格方案',
        subtitle: '选择合适的方案开始您的碳足迹之旅',
        plans: {
          free: {
            title: '免费版',
            price: '$0',
            features: ['每月免费匹配50次', '需要注册'],
            button: '开始使用'
          },
          standard: {
            title: '标准版',
            price: '$98',
            popular: '热门',
            features: ['每月200次匹配', '相当于3-5份报告'],
            button: '立即升级'
          },
          enterprise: {
            title: '企业版',
            price: '定制',
            features: ['ERP/CRM集成', '供应链管理'],
            button: '联系销售'
          }
        }
      },
      value: {
        cards: {
          cost: {
            title: '1%成本',
            subtitle: '成本降低',
            description: '每份可信报告低于70美元'
          },
          time: {
            title: '小时级',
            subtitle: '时间节省',
            description: '从数月到数小时'
          },
          barrier: {
            title: '零门槛',
            subtitle: '零经验要求',
            description: '任何角色都能创建可信结果'
          },
          trusted: {
            title: '可信赖',
            subtitle: '验证级可信度',
            description: '虚拟认证顾问'
          }
        }
      },
      moreInfo: '获取更多信息'
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
        steps: '4\n步骤',
        stepList: ['① 最少数据', '② 确认', '③ 发送验证方', '④ 认证']
      },
      consultant: {
        title: '第三方碳顾问 + 碳核算软件',
        steps: '11\n步骤',
        stepList: ['① 培训', '② 文档+法规映射', '③ 数据清单', '④ 数据清理', '⑤ 填补空缺', '⑥ 构建模型', '⑦ 因子匹配', '⑧ 提交', '⑨ 问题清单', '⑩ 修正', '⑪ 认证']
      },
      traditional: {
        title: '第三方碳顾问',
        steps: '12\n步骤',
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
        industry: '行业',
        message: '留言',
        submit: '发送消息',
        submitting: '发送中...',
        placeholder: {
          name: '请输入您的姓名',
          email: '请输入您的邮箱',
          phone: '请输入您的电话号码',
          company: '请输入公司名称',
          industry: '请选择您的行业',
          message: '请描述您的需求或问题'
        },
        industries: {
          automotive: '汽车制造业',
          electronics: '电子电器',
          textiles: '纺织服装',
          chemicals: '化工化学',
          foodBeverage: '食品饮料',
          construction: '建筑建材',
          metals: '钢铁金属',
          plastics: '塑料橡胶',
          packaging: '包装印刷',
          pharmaceuticals: '医药医疗',
          energy: '能源电力',
          manufacturing: '机械制造',
          furniture: '家具家居',
          cosmetics: '美妆个护',
          toys: '玩具用品',
          agriculture: '农业食品',
          transportation: '交通运输',
          retail: '零售贸易',
          other: '其他'
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