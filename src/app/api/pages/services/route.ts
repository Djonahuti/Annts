import { NextRequest, NextResponse } from 'next/server';
import { proxyToPHP } from '@/lib/php-api';

// Required for static export
export const dynamic = 'force-static';

interface PrismaPage {
  id: number;
  title: string;
  slug: string;
  is_published: boolean;
  meta_description: string | null;
  text: string | null;
  hero_big_black: string | null;
  hero_big_primary: string | null;
  hero_text: string | null;
  hero_year: string | null;
  hero_year_span: string | null;
  hero_100: string | null;
  hero_100_span: string | null;
  hero_24: string | null;
  hero_24_span: string | null;
  hero_primary_button: string | null;
  hero_secondary_button: string | null;
  body_heading: string | null;
  body_sub_heading: string | null;
  body_first_text: string | null;
  body_second_text: string | null;
  body_heading2: string | null;
  body_sub_heading2: string | null;
  body_heading3: string | null;
  body_sub_heading3: string | null;
  body_heading4: string | null;
  body_sub_heading4: string | null;
  section_text: string | null;
  section_head: string | null;
  section_primary_btn: string | null;
  section_secondary_btn: string | null;
  team_img: string | null;
  team_text: string | null;
  team_role: string | null;
  team_img2: string | null;
  team_text2: string | null;
  team_role2: string | null;
  team_img3: string | null;
  team_text3: string | null;
  team_role3: string | null;
  box_head: string | null;
  box_text: string | null;
  box_head2: string | null;
  box_text2: string | null;
  box_head3: string | null;
  box_text3: string | null;
  box_head4: string | null;
  box_text4: string | null;
  box_head5: string | null;
  box_text5: string | null;
  box_head6: string | null;
  box_text6: string | null;
  box_head7: string | null;
  box_text7: string | null;
  box_head8: string | null;
  box_text8: string | null;
  box_head9: string | null;
  box_text9: string | null;
  hp: string[] | null
  fm: string[] | null  
}

export async function GET(request: NextRequest) {
  try {
    const response = await proxyToPHP('/api/pages/services', {
      method: 'GET',
      headers: request.headers,
    });
    return response;
  } catch (error) {
    console.error('Error fetching service page:', error);
    return NextResponse.json({ error: 'Failed to fetch service page' }, { status: 500 });
  }
}