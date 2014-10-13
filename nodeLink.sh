#!/bin/sh

node fixPath.js id business_license org_cert tax_no snz_companies

node fixPath.js id open_license snz_company_finances

node fixPath.js id in_rank_file out_rank_file snz_company_ranks

node fixPath.js id facility_attach_url lab_attach_url patents_attach_url success_stories_attach_url snz_company_extra_rd

node fixPath.js id rohs_attach_url iso9001_attach_url iso14001_attach_url ts16949_attach_url number_for_quality_attach_url auditor_attach_url lab_attach_url qualified_attach_url snz_company_extra_quality

node fixPath.js id list_of_equipments list_of_automation_equipment snz_company_extra_delivery

node fixPath.js id content snz_supplier_resource_material_logs

node fixPath.js id claim_doc snz_user_complaints

node fixPath.js id files snz_topics

node fixPath.js id accessories transact_file snz_requirements

node fixPath.js id solution_file snz_requirement_solutions