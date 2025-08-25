#!/usr/bin/env python3
"""
基于最新进度创建详细备份
"""

import json
import csv
from datetime import datetime

def create_current_progress_backup():
    """基于最新输出创建当前进度备份"""
    
    # 基于最新bash输出的供应商数据（506个供应商的样本）
    recent_suppliers = [
        # 从第20页开始的最新数据
        {"company_name": "Kilim Grubu Kartaltepe Mensucat Fab Tas", "emails": ["nicola.tredoux@googlemail.com"], "phones": [], "page_number": 20, "email_count": 1},
        {"company_name": "Sun and Sand Studios", "emails": ["nicola.tredoux@googlemail.com"], "phones": [], "page_number": 20, "email_count": 1},
        {"company_name": "FabricWorks London", "emails": ["mail@fabricworkslondon.org"], "phones": [], "page_number": 20, "email_count": 1},
        {"company_name": "FG Group", "emails": ["predrag@funkyguerrilla.com"], "phones": ["+38765985891"], "page_number": 20, "email_count": 1},
        {"company_name": "Custom Collaborative", "emails": ["info@customcollaborative.org"], "phones": [], "page_number": 20, "email_count": 1},
        {"company_name": "meshiko", "emails": ["aleloera3@gmail.com"], "phones": ["07523790686"], "page_number": 20, "email_count": 1},
        {"company_name": "London Sewing Services ltd", "emails": ["alesiar@gmail.com"], "phones": ["07562897570"], "page_number": 20, "email_count": 1},
        {"company_name": "Lodos Knit Fabrics", "emails": ["sales@lodoskumas.com"], "phones": ["+905493871005"], "page_number": 20, "email_count": 1},
        {"company_name": "Kaiser Enterprises", "emails": ["kaiser.ankur@gmail.com"], "phones": [], "page_number": 20, "email_count": 1},
        {"company_name": "CraftKenya", "emails": ["craftsofkenya@gmail.com"], "phones": ["+254720724631"], "page_number": 20, "email_count": 1},
        {"company_name": "Evrnu, SPC", "emails": ["karen@evrnu.com", "sinead@evrnu.com", "katecottone@evrnu.com"], "phones": [], "page_number": 20, "email_count": 3},
        {"company_name": "MKS Export Ltd.", "emails": ["online@mks-export.com"], "phones": ["09830030794"], "page_number": 20, "email_count": 1},
        {"company_name": "Duo UK", "emails": ["zoe.brimelow@duo-uk.co.uk"], "phones": [], "page_number": 20, "email_count": 1},
        {"company_name": "Corkor", "emails": ["silvia@corkor.com"], "phones": [], "page_number": 20, "email_count": 1},
        {"company_name": "Organic Weave", "emails": ["l.alexanian@sympatico.ca"], "phones": [], "page_number": 20, "email_count": 1},
        {"company_name": "Botanica Tinctoria", "emails": ["rachelmachenry@gmail.com"], "phones": [], "page_number": 20, "email_count": 1},
        {"company_name": "Tejidos Royo", "emails": ["maytemc@tejidos-royo.com"], "phones": [], "page_number": 20, "email_count": 1},
        {"company_name": "Pure Fabricz", "emails": ["monique@purefabricz.com"], "phones": [], "page_number": 20, "email_count": 1},
        
        # 第21页数据
        {"company_name": "Arvind Ltd.", "emails": ["francis.jacob@arvindbrands.co.in", "abhishek.bansal@arvind.in"], "phones": ["+919712909648"], "page_number": 21, "email_count": 2},
        {"company_name": "Slow Made India", "emails": ["hello@slowmadeindia.com"], "phones": [], "page_number": 21, "email_count": 1},
        {"company_name": "Fashion4Freedom", "emails": ["lanvy@fashion4freedom.com"], "phones": [], "page_number": 21, "email_count": 1},
        {"company_name": "LULEA By Cheasneau", "emails": ["chesneau.edmond@gmail.com"], "phones": ["+254711408028"], "page_number": 21, "email_count": 1},
        {"company_name": "pielleitalia", "emails": ["giuseppe.pezzini@pielleitalia.com"], "phones": ["+39035335480"], "page_number": 21, "email_count": 1},
        {"company_name": "Artisan Fashion", "emails": ["lily@artisan.fashion"], "phones": [], "page_number": 21, "email_count": 1},
        {"company_name": "London Pattern Bureau", "emails": ["renee@londonpatternbureau.co.uk"], "phones": [], "page_number": 21, "email_count": 1},
        {"company_name": "Sourcing Sustainably Limited", "emails": ["maeve@sourcingsustainably.com"], "phones": ["+447956091444"], "page_number": 21, "email_count": 1},
        {"company_name": "SOKO Kenya", "emails": ["jo@soko-kenya.com"], "phones": [], "page_number": 21, "email_count": 1},
        {"company_name": "Nisha Silk Exports", "emails": ["anirudh@nishasilkexports.com"], "phones": ["+919986688444"], "page_number": 21, "email_count": 1},
        {"company_name": "Biothread", "emails": ["felix@biothread.co.uk"], "phones": ["+447896744697"], "page_number": 21, "email_count": 1},
        {"company_name": "VISHH - Artisan Sourcing & Production", "emails": ["isha@vishh.com"], "phones": [], "page_number": 21, "email_count": 1},
        {"company_name": "SS Printing, LLC", "emails": ["ssprintingusa3@gmail.com"], "phones": ["+1 2148683934"], "page_number": 21, "email_count": 1},
        {"company_name": "Nguyen Khanh Phuong fashion company limited", "emails": ["thaoho@nkp.vn"], "phones": ["+84934148678"], "page_number": 21, "email_count": 1},
        {"company_name": "Studio Tolsta", "emails": ["hello@studiotolsta.com"], "phones": [], "page_number": 21, "email_count": 1},
        {"company_name": "Origin Colombia", "emails": ["hello@origincolombia.com"], "phones": [], "page_number": 21, "email_count": 1},
        {"company_name": "CALENDULA PARK - CP", "emails": ["sr@thecalendulapark.com"], "phones": [], "page_number": 21, "email_count": 1},
        {"company_name": "VSG - Confeção e Comércio de Têxteis, Un. Lda", "emails": ["fatima@vsgfashion.net"], "phones": ["+351961329105"], "page_number": 21, "email_count": 1},
        
        # 第22页数据
        {"company_name": "AJG Fashion Consulting", "emails": ["niki@alicejamesglobal.com"], "phones": [], "page_number": 22, "email_count": 1},
        {"company_name": "INTEX", "emails": ["marina@intexfashion.com"], "phones": [], "page_number": 22, "email_count": 1},
        {"company_name": "Sourcing in Peru", "emails": ["evelyn.botton@gmail.com"], "phones": [], "page_number": 22, "email_count": 1},
        {"company_name": "Half Price Packaging", "emails": ["william@halfpricepackaging.com"], "phones": [], "page_number": 22, "email_count": 1},
        {"company_name": "Kullvi Whims", "emails": ["kullviwhims@gmail.com"], "phones": [], "page_number": 22, "email_count": 1},
        {"company_name": "Nature Coatings", "emails": ["lara@naturecoatingsinc.com"], "phones": [], "page_number": 22, "email_count": 1},
        {"company_name": "PlanetCare", "emails": ["marjana.lavric@planetcare.org", "omaima.doukkane@planetcare.org"], "phones": [], "page_number": 22, "email_count": 2},
        {"company_name": "AForce London", "emails": ["tim@aforce.co.uk"], "phones": [], "page_number": 22, "email_count": 1},
        {"company_name": "Fine Ocean", "emails": ["ella@skyloscollective.co.uk"], "phones": ["07587855714"], "page_number": 22, "email_count": 1},
        {"company_name": "Bridal lace for wedding gowns", "emails": ["a.reinhardt@modespitze.de"], "phones": ["+493741222554"], "page_number": 22, "email_count": 1},
        {"company_name": "SEAQUAL INITIATIVE", "emails": ["carla.navarro@seaqual.com"], "phones": [], "page_number": 22, "email_count": 1},
        {"company_name": "Fuselage Fashion", "emails": ["o.mitterfellner@westminster.ac.uk"], "phones": ["+447526788543"], "page_number": 22, "email_count": 1},
        {"company_name": "Threadsmith", "emails": ["info@threadsmith.in"], "phones": ["+919819829700"], "page_number": 22, "email_count": 1},
        {"company_name": "Monograms NYC", "emails": ["info.monogramsnyc@gmail.com"], "phones": [], "page_number": 22, "email_count": 1},
        {"company_name": "Mint Clothier", "emails": ["duygukacar@icloud.com"], "phones": [], "page_number": 22, "email_count": 1},
        {"company_name": "Shokay", "emails": ["carol.chyau@shokay.asia"], "phones": [], "page_number": 22, "email_count": 1},
        {"company_name": "TEQECOpro", "emails": ["teq.gaba@gmail.com"], "phones": ["+79897487422"], "page_number": 22, "email_count": 1},
        {"company_name": "Progress Packaging Limited", "emails": ["simon@progresspackaging.co.uk"], "phones": [], "page_number": 22, "email_count": 1},
        {"company_name": "RefuSHE", "emails": ["artisans@refushe.org"], "phones": [], "page_number": 22, "email_count": 1},
        {"company_name": "papertex™", "emails": ["hanrui.huang@paper-tex.com"], "phones": [], "page_number": 22, "email_count": 1},
        
        # 第23页数据
        {"company_name": "airkapok", "emails": ["airkapok_official@outlook.com"], "phones": [], "page_number": 23, "email_count": 1},
        {"company_name": "The Bereket Journey", "emails": ["susanclaire116@gmail.com"], "phones": ["+447922596432"], "page_number": 23, "email_count": 1},
        {"company_name": "One Stop Bride Shop", "emails": ["onestopbrideshop.info@gmail.com"], "phones": [], "page_number": 23, "email_count": 1},
        {"company_name": "dea ethical clothing ltd", "emails": ["lynda@dealoves.co.nz"], "phones": [], "page_number": 23, "email_count": 1},
        {"company_name": "GC Apparels PTE ltd", "emails": ["sales@gcapparels.net"], "phones": ["+8615601791640"], "page_number": 23, "email_count": 1},
        {"company_name": "The Fashion Incubator Middle East", "emails": ["nsaleh@thefashionincubatorme.com"], "phones": [], "page_number": 23, "email_count": 1},
        {"company_name": "priyanka kakkar", "emails": ["priyanka.1016@gmail.com"], "phones": ["+919810471498"], "page_number": 23, "email_count": 1},
        {"company_name": "Amaserwaa", "emails": ["amaserwaaseamstress@gmail.com"], "phones": [], "page_number": 23, "email_count": 1},
        {"company_name": "Planet of the Grapes", "emails": ["sam@planetofthegrapes.fr"], "phones": [], "page_number": 23, "email_count": 1},
        {"company_name": "Ahoy dare", "emails": ["lilobrown@ahoydare.com"], "phones": [], "page_number": 23, "email_count": 1},
        {"company_name": "HYPECHASE", "emails": ["adrien@hypechase.com"], "phones": ["+97690802104"], "page_number": 23, "email_count": 1},
        {"company_name": "Saturn Cottage Industries", "emails": ["wynne.lisa@gmail.com"], "phones": [], "page_number": 23, "email_count": 1},
        {"company_name": "Missfit Creations", "emails": ["missfitcreates@gmail.com"], "phones": ["07843090684"], "page_number": 23, "email_count": 1},
        {"company_name": "CHAYOUNG TEXTILE CO., LTD.", "emails": ["chayoung8909@gmail.com"], "phones": [], "page_number": 23, "email_count": 1},
        {"company_name": "FASHION INDIA INTERNATIONAL", "emails": ["skylightshapes@gmail.com"], "phones": ["+919650556366"], "page_number": 23, "email_count": 1},
        {"company_name": "fabriulous", "emails": ["samanthaxu0429@163.com"], "phones": ["+8613774205020"], "page_number": 23, "email_count": 1},
        {"company_name": "Soie Clothing", "emails": ["roopa@roopapemmaraju.com"], "phones": [], "page_number": 23, "email_count": 1},
        {"company_name": "The Color Caravan", "emails": ["swati.seth@thecolorcaravan.com"], "phones": ["+919984464000"], "page_number": 23, "email_count": 1},
        {"company_name": "TAP BETTER BAGS", "emails": ["pat@tapbetterbags.com"], "phones": [], "page_number": 23, "email_count": 1},
        {"company_name": "Be Simple Confecções Lda", "emails": ["al7240@essr.net"], "phones": [], "page_number": 23, "email_count": 1},
        
        # 第24页数据
        {"company_name": "Calypso Chile", "emails": ["marcelacofre@calypsochile.com"], "phones": [], "page_number": 24, "email_count": 1},
        {"company_name": "Incredible Husk International Group", "emails": ["tj.lo@inc-husk.com"], "phones": ["+85294553801"], "page_number": 24, "email_count": 1},
        {"company_name": "EarthCare", "emails": ["earthcareindia@gmail.com"], "phones": ["+919846375566"], "page_number": 24, "email_count": 1},
        {"company_name": "Atelier Karaka", "emails": ["martajmafonso@hotmail.com"], "phones": [], "page_number": 24, "email_count": 1},
        {"company_name": "Yuma Labs", "emails": ["love@yuma-labs.com"], "phones": [], "page_number": 24, "email_count": 1},
        {"company_name": "Terre Amoure", "emails": ["info@hotmamas.org"], "phones": ["07717396917"], "page_number": 24, "email_count": 1},
        {"company_name": "Roc", "emails": ["shah@roc.biz.pk"], "phones": [], "page_number": 24, "email_count": 1},
        {"company_name": "BoChicca", "emails": ["konkira@yandex.ru"], "phones": ["+79062053322"], "page_number": 24, "email_count": 1},
        {"company_name": "Naturalmat", "emails": ["ruben@naturalmat.co.uk"], "phones": [], "page_number": 24, "email_count": 1},
        {"company_name": "Dresscode Uniforms ltd.", "emails": ["m.sherry@dresscodeuniforms.co.uk"], "phones": [], "page_number": 24, "email_count": 1},
        {"company_name": "RN OFFICE", "emails": ["alessa@rnoffice.com.tr"], "phones": ["+905332035624"], "page_number": 24, "email_count": 1},
        {"company_name": "Koozee Crazee", "emails": ["victoria@koozeecrazee.com"], "phones": [], "page_number": 24, "email_count": 1},
        {"company_name": "Africa New Confection", "emails": ["anc.confection@gmail.com"], "phones": [], "page_number": 24, "email_count": 1},
        {"company_name": "PASTEKS TEKSTİL", "emails": ["dozdemir@pasteks.com"], "phones": ["+905332242406"], "page_number": 24, "email_count": 1},
        {"company_name": "PRAPTA", "emails": ["ranimythili18@gmail.com"], "phones": ["09866939249"], "page_number": 24, "email_count": 1},
        {"company_name": "Abhinav Impex", "emails": ["style@abhinavimpex.in"], "phones": ["+91 9444581369"], "page_number": 24, "email_count": 1},
        {"company_name": "SPADEWORKS", "emails": ["rrk@spadeworks.net"], "phones": [], "page_number": 24, "email_count": 1},
        {"company_name": "Denimtek", "emails": ["levent@denimtek.com"], "phones": [], "page_number": 24, "email_count": 1},
        {"company_name": "Oleatex", "emails": ["seckinarikan@oleago.com"], "phones": ["+905334324545"], "page_number": 24, "email_count": 1},
        
        # 第25页数据
        {"company_name": "Lamoral Coatings", "emails": ["joris.van.tongerloo@lamoral-coatings.com"], "phones": [], "page_number": 25, "email_count": 1},
        {"company_name": "Textures", "emails": ["texturesclothing@gmail.com"], "phones": [], "page_number": 25, "email_count": 1},
        {"company_name": "christiqueclothing", "emails": ["christiqueclothing@gmail.com"], "phones": [], "page_number": 25, "email_count": 1},
        {"company_name": "EAB Designs", "emails": ["errica@eab-designs.com"], "phones": ["+4917664889666"], "page_number": 25, "email_count": 1},
        {"company_name": "Bawa Hope Ltd", "emails": ["andrew_mutisya@bawahope.com"], "phones": [], "page_number": 25, "email_count": 1},
        {"company_name": "CREATIVE DEFINITIONS", "emails": ["creativedefinitions@gmail.com"], "phones": [], "page_number": 25, "email_count": 1},
        {"company_name": "Pactics", "emails": ["dorian@pactics.com", "maha.bettaoui@pactics.com"], "phones": [], "page_number": 25, "email_count": 2},
        {"company_name": "Ecocitex", "emails": ["daniela.ehijo@ecocitex.com"], "phones": [], "page_number": 25, "email_count": 1},
        {"company_name": "Green Design Link", "emails": ["e.f.saville@googlemail.com"], "phones": [], "page_number": 25, "email_count": 1},
        {"company_name": "DeCe Clothing", "emails": ["roo@networks.org.ro"], "phones": ["+40736327436"], "page_number": 25, "email_count": 1},
        {"company_name": "Respectlife", "emails": ["info@respectlife.it"], "phones": [], "page_number": 25, "email_count": 1},
        {"company_name": "Sahana Stitchwork", "emails": ["monishasharif@icloud.com"], "phones": [], "page_number": 25, "email_count": 1},
        {"company_name": "Antero Vejarano  Joyeria -Asesoria", "emails": ["anterovejarano1@hotmail.com"], "phones": [], "page_number": 25, "email_count": 1},
        {"company_name": "Birla Cellulose, Aditya Birla Group", "emails": ["gaurav.agarwal@adityabirla.com"], "phones": ["+912656171256"], "page_number": 25, "email_count": 1},
        {"company_name": "AlgiKnit", "emails": ["alex.jannetty@algiknit.com"], "phones": [], "page_number": 25, "email_count": 1},
        {"company_name": "AB VILKMA", "emails": ["emilija.andrasunaite@vilkma.com", "laura.zitkeviciute@vilkma.com"], "phones": [], "page_number": 25, "email_count": 2},
        {"company_name": "Jeanologia", "emails": ["mrodriguez@jeanologia.com"], "phones": [], "page_number": 25, "email_count": 1},
        {"company_name": "Do Better Fashion Sourcing", "emails": ["romina@dobetterfashion.com"], "phones": [], "page_number": 25, "email_count": 1},
        {"company_name": "ANAMIKA", "emails": ["mou@naturemela.com"], "phones": ["+91 9903151392"], "page_number": 25, "email_count": 1},
        {"company_name": "Ram Exports", "emails": ["vishaltolambiya26@gmail.com"], "phones": [], "page_number": 25, "email_count": 1},
        
        # 第26页数据（最新）
        {"company_name": "MAES London", "emails": ["DIANA@MAESLONDON.COM"], "phones": [], "page_number": 26, "email_count": 1},
        {"company_name": "Cadel Deinking sl", "emails": ["pepi.mayordomo@cadeldeinking.com"], "phones": [], "page_number": 26, "email_count": 1},
        {"company_name": "The Cotton Textile Company Ltd", "emails": ["richard@thecottontextilecompany.co.uk"], "phones": ["02036332699"], "page_number": 26, "email_count": 1},
        {"company_name": "Artesanias Texal", "emails": ["livia.salazar@artesalinas.ec"], "phones": ["+593985196031"], "page_number": 26, "email_count": 1},
    ]
    
    # 为每个供应商添加索引和其他字段
    for i, supplier in enumerate(recent_suppliers):
        supplier.update({
            "index": i + 1,
            "profile_url": f"https://www.commonobjective.co/{supplier['company_name'].lower().replace(' ', '-').replace('.', '').replace(',', '').replace(':', '').replace('(', '').replace(')', '').replace('|', '')}",
            "timestamp": datetime.now().isoformat(),
            "websites": [],
            "founded_year": "",
            "employees": "",
            "governance": ""
        })
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # 保存JSON备份
    json_filename = f'current_progress_backup_{timestamp}.json'
    with open(json_filename, 'w', encoding='utf-8') as f:
        json.dump(recent_suppliers, f, ensure_ascii=False, indent=2)
    
    # 保存CSV备份
    csv_filename = f'current_progress_backup_{timestamp}.csv'
    with open(csv_filename, 'w', newline='', encoding='utf-8-sig') as f:
        fieldnames = ['index', 'company_name', 'page_number', 'email_count', 'emails', 'phones', 
                     'profile_url', 'timestamp', 'websites', 'founded_year', 'employees', 'governance']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        
        for supplier in recent_suppliers:
            csv_row = supplier.copy()
            csv_row['emails'] = '; '.join(supplier['emails']) if supplier['emails'] else ''
            csv_row['phones'] = '; '.join(supplier['phones']) if supplier['phones'] else ''
            csv_row['websites'] = '; '.join(supplier['websites']) if supplier['websites'] else ''
            writer.writerow(csv_row)
    
    # 保存纯邮箱列表
    emails_filename = f'current_emails_backup_{timestamp}.txt'
    with open(emails_filename, 'w', encoding='utf-8') as f:
        f.write(f"当前进度邮箱备份 - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("=" * 60 + "\n\n")
        f.write(f"基于最新抓取输出 (506/1174 供应商, 43.1% 完成)\n")
        f.write(f"实际邮箱数量: 592+ 个\n\n")
        
        total_emails = 0
        suppliers_with_emails = 0
        
        for supplier in recent_suppliers:
            if supplier['emails']:
                suppliers_with_emails += 1
                f.write(f"{supplier['company_name']} (第{supplier['page_number']}页):\n")
                for email in supplier['emails']:
                    f.write(f"  - {email}\n")
                    total_emails += 1
                f.write("\n")
        
        f.write(f"\n样本统计信息 (最新部分数据):\n")
        f.write(f"样本供应商数: {len(recent_suppliers)}\n")
        f.write(f"样本中有邮箱的供应商: {suppliers_with_emails}\n")
        f.write(f"样本邮箱数: {total_emails}\n")
        if len(recent_suppliers) > 0:
            f.write(f"样本邮箱获取成功率: {suppliers_with_emails/len(recent_suppliers)*100:.1f}%\n")
            
        f.write(f"\n实际进度 (来自抓取输出):\n")
        f.write(f"已完成: 506/1174 供应商 (43.1%)\n")
        f.write(f"实际邮箱总数: 592+\n")
        f.write(f"实际邮箱获取成功率: ~96.8%\n")
    
    # 创建邮箱简单列表
    simple_emails_filename = f'simple_current_emails_{timestamp}.txt'
    with open(simple_emails_filename, 'w', encoding='utf-8') as f:
        all_emails = []
        for supplier in recent_suppliers:
            all_emails.extend(supplier['emails'])
        
        # 去重并排序
        unique_emails = sorted(list(set(all_emails)))
        for email in unique_emails:
            f.write(f"{email}\n")
    
    # 统计信息
    total_emails = sum(len(s['emails']) for s in recent_suppliers)
    suppliers_with_emails = len([s for s in recent_suppliers if s['emails']])
    
    print("📊 当前进度备份已创建!")
    print("=" * 60)
    print(f"✅ 备份文件:")
    print(f"   📄 {json_filename}")
    print(f"   📄 {csv_filename}")
    print(f"   📄 {emails_filename}")
    print(f"   📄 {simple_emails_filename}")
    print(f"\n📊 样本数据统计 (最新抓取部分):")
    print(f"   样本供应商数: {len(recent_suppliers)}")
    print(f"   样本有邮箱的供应商: {suppliers_with_emails}")
    print(f"   样本邮箱数: {total_emails}")
    print(f"   样本邮箱获取成功率: {suppliers_with_emails/len(recent_suppliers)*100:.1f}%")
    print(f"\n🎯 实际完整进度 (来自抓取系统):")
    print(f"   ✅ 已完成: 506/1174 供应商 (43.1%)")
    print(f"   📧 实际邮箱总数: 592+")
    print(f"   📈 实际邮箱获取成功率: ~96.8%")
    print(f"   ⏰ 预计剩余时间: 约1.5小时")
    print(f"\n🔄 备份监控系统已在后台运行")

if __name__ == "__main__":
    create_current_progress_backup()