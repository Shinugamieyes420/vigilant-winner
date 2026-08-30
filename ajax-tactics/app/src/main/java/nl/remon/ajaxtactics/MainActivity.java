package nl.remon.ajaxtactics;

import android.app.*;
import android.os.Bundle;
import android.graphics.*;
import android.graphics.drawable.GradientDrawable;
import android.view.*;
import android.widget.*;
import android.content.*;
import java.util.*;

public class MainActivity extends Activity {
    TacticsView board;
    TextView status;
    Spinner teamSpinner;
    @Override public void onCreate(Bundle b){
        super.onCreate(b);
        LinearLayout root=new LinearLayout(this); root.setOrientation(LinearLayout.HORIZONTAL);
        root.setBackgroundColor(Color.rgb(18,18,22));

        LinearLayout side=new LinearLayout(this); side.setOrientation(LinearLayout.VERTICAL);
        side.setPadding(12,12,12,12); side.setBackgroundColor(Color.rgb(30,30,36));
        root.addView(side,new LinearLayout.LayoutParams(dp(245),-1));

        TextView title=new TextView(this); title.setText("AJAX TACTICS\nMANAGER"); title.setTextSize(20);
        title.setTextColor(Color.WHITE); title.setTypeface(Typeface.DEFAULT_BOLD);
        side.addView(title);

        teamSpinner=new Spinner(this);
        ArrayAdapter<String> adapter=new ArrayAdapter<>(this,android.R.layout.simple_spinner_dropdown_item,
                new String[]{"Ajax vs PSV","Ajax opstelling","PSV opstelling"});
        teamSpinner.setAdapter(adapter); side.addView(teamSpinner);

        status=new TextView(this); status.setTextColor(Color.LTGRAY); status.setTextSize(13);
        status.setPadding(0,10,0,10); side.addView(status);

        Button link=button("Koppel spelers");
        Button save=button("Opslaan");
        Button reset=button("Reset");
        Button rate=button("Analyse");
        side.addView(link); side.addView(save); side.addView(reset); side.addView(rate);

        TextView help=new TextView(this);
        help.setText("\nGebruik:\n• Sleep spelers over het veld\n• Tik 'Koppel spelers', daarna 2 spelers\n• Tik op een lijn voor synergie\n• Houd een speler ingedrukt voor profiel");
        help.setTextColor(Color.LTGRAY); help.setTextSize(12); side.addView(help);

        board=new TacticsView(this,status);
        root.addView(board,new LinearLayout.LayoutParams(0,-1,1));
        setContentView(root);

        link.setOnClickListener(v->board.toggleLinkMode());
        save.setOnClickListener(v->board.saveLayout());
        reset.setOnClickListener(v->board.reset());
        rate.setOnClickListener(v->showAnalysis());
        teamSpinner.setOnItemSelectedListener(new android.widget.AdapterView.OnItemSelectedListener(){
            public void onItemSelected(android.widget.AdapterView<?> p,View v,int pos,long id){ board.setMode(pos); }
            public void onNothingSelected(android.widget.AdapterView<?> p){}
        });
    }
    Button button(String s){ Button b=new Button(this); b.setText(s); return b; }
    int dp(int v){ return (int)(v*getResources().getDisplayMetrics().density); }

    void showAnalysis(){
        String msg="Mijn Ajax-baseline voor PSV:\n\n"+
        "Ter Stegen\nRosa – Bouwman – Baas – Caio Henrique\nAmrabat\nBrandt – Gloukh\nTsygankov – Tolu – Leonardo\n\n"+
        "Sterkste koppelingen:\n"+
        "• Amrabat ↔ Brandt: 88/100 — balans + opbouw\n"+
        "• Brandt ↔ Gloukh: 86/100 — combinatie en derde man\n"+
        "• Caio ↔ Leonardo: 84/100 — voorzetten + box movement\n"+
        "• Tsygankov ↔ Tolu: 83/100 — service op sterke targetman\n"+
        "• Bouwman ↔ Amrabat: 82/100 — rugdekking en eerste pass\n\n"+
        "Risico: PSV kan ruimte achter de backs aanvallen. Daarom Amrabat als echte 6 laten blijven.";
        new AlertDialog.Builder(this).setTitle("Tactische analyse").setMessage(msg).setPositiveButton("OK",null).show();
    }

    public static class Player {
        String name,team,role,profile; float x,y; int rating;
        Player(String n,String t,String r,float x,float y,int q,String p){
            name=n;team=t;role=r;this.x=x;this.y=y;rating=q;profile=p;
        }
    }
    public static class Link {
        Player a,b; int score; String note;
        Link(Player a,Player b,int s,String n){this.a=a;this.b=b;score=s;note=n;}
    }

    public static class TacticsView extends View {
        Paint p=new Paint(1); ArrayList<Player> players=new ArrayList<>(); ArrayList<Link> links=new ArrayList<>();
        Player drag=null, firstLink=null; float offX,offY; boolean linkMode=false; int mode=0;
        TextView status; SharedPreferences prefs; long downAt; Player downPlayer;
        RectF field=new RectF();

        TacticsView(Context c,TextView s){
            super(c); status=s; prefs=c.getSharedPreferences("tactics",0); setBackgroundColor(Color.rgb(10,70,42));
            seed(); status.setText("Ajax–PSV • sleep spelers");
        }
        void seed(){
            players.clear(); links.clear();
            // Ajax
            add("Ter Stegen","Ajax","GK",.50f,.91f,90,"Elite meevoetballende keeper. Hoge lijn ondersteunen.");
            add("Rosa","Ajax","RB",.18f,.74f,77,"Atletisch, agressief, overlap.");
            add("Bouwman","Ajax","RCB",.39f,.78f,80,"Snel, fysiek, groot plafond.");
            add("Baas","Ajax","LCB",.61f,.78f,83,"Betrouwbare opbouw en dekking.");
            add("Caio Henrique","Ajax","LB",.82f,.74f,84,"Creatieve back, sterke linkerflank.");
            add("Amrabat","Ajax","DM",.50f,.61f,84,"Positionele 6, balvast, beschermt restverdediging.");
            add("Brandt","Ajax","CM",.38f,.48f,85,"Creatieve verbindingsspeler.");
            add("Gloukh","Ajax","AM",.62f,.46f,85,"Dribbel, tussen linies, rendement.");
            add("Tsygankov","Ajax","RW",.18f,.28f,84,"Linksbenige maker vanaf rechts.");
            add("Tolu","Ajax","ST",.50f,.18f,84,"1.97m targetman, sterk in box en kaats.");
            add("Leonardo","Ajax","LW/ST",.82f,.28f,82,"Top movement, finishing dit seizoen wisselvallig.");
            add("Blind","Ajax","CB",.08f,.89f,79,"Elite passer, minder sterk in grote ruimte.");
            add("Dolberg","Ajax","ST",.92f,.89f,77,"Technische spits en kaatser.");
            add("Ouazane","Ajax","AM",.08f,.96f,78,"17 jaar, creatief, hoge upside.");
            add("Torrents","Ajax","LB/LM",.92f,.96f,77,"Technische linkerflankoptie.");

            // PSV
            add("Kovar","PSV","GK",.50f,.08f,81,"Meevoetballende keeper.");
            add("Dest","PSV","RB",.82f,.24f,83,"Zeer aanvallende en dynamische back.");
            add("Flamingo","PSV","RCB",.61f,.20f,82,"Snel, fysiek, kan doordekken.");
            add("Obispo","PSV","LCB",.39f,.20f,76,"Linksbenige CV.");
            add("Mauro Jr.","PSV","LB",.18f,.24f,81,"Technisch, flexibel, intensiteit.");
            add("Sano","PSV","DM",.50f,.37f,82,"Dynamische 6, balveroveraar, opvolger Veerman.");
            add("Fernandez","PSV","CM",.62f,.43f,79,"Talentvolle middenvelder, techniek en loopvermogen.");
            add("Til","PSV","AM",.38f,.43f,82,"Extreem sterk zonder bal en in de zestien.");
            add("Perisic","PSV","RW/LW",.82f,.58f,84,"Ervaring, voorzet, afwerking.");
            add("Pepi","PSV","ST",.50f,.70f,85,"Diepte, pressing, sterke afmaker.");
            add("Van Bommel","PSV","LW",.18f,.58f,81,"Directe buitenspeler, diepgang.");
            add("Geertruida","PSV","DEF",.08f,.05f,84,"Topniveau multifunctionele verdediger.");
            add("Kostic","PSV","LWB/LW",.92f,.05f,82,"Voorzet en linkerflankpower.");
            add("Mijnans","PSV","CM",.08f,.12f,80,"Dynamiek en scorend vermogen.");

            autoLink("Amrabat","Brandt",88,"Balans + progressieve opbouw");
            autoLink("Brandt","Gloukh",86,"Combinaties tussen de linies");
            autoLink("Caio Henrique","Leonardo",84,"Voorzetten + box movement");
            autoLink("Tsygankov","Tolu",83,"Voorzetten en tweede ballen");
            autoLink("Bouwman","Amrabat",82,"Rugdekking + eerste pass");
            autoLink("Sano","Til",84,"Balverovering + box runs");
            autoLink("Dest","Perisic",82,"Overlaps + eindproduct");
        }
        void add(String n,String t,String r,float x,float y,int q,String pr){players.add(new Player(n,t,r,x,y,q,pr));}
        Player find(String n){for(Player x:players)if(x.name.equals(n))return x;return null;}
        void autoLink(String a,String b,int s,String n){links.add(new Link(find(a),find(b),s,n));}

        void setMode(int m){mode=m; invalidate();}
        boolean visible(Player x){ return mode==0 || (mode==1&&x.team.equals("Ajax")) || (mode==2&&x.team.equals("PSV")); }

        protected void onDraw(Canvas c){
            super.onDraw(c);
            float pad=18; field.set(pad,pad,getWidth()-pad,getHeight()-pad);
            p.setStyle(Paint.Style.FILL); p.setColor(Color.rgb(27,125,74)); c.drawRoundRect(field,18,18,p);
            p.setStyle(Paint.Style.STROKE); p.setStrokeWidth(3); p.setColor(Color.WHITE);
            c.drawRect(field,p); c.drawLine(field.left,field.centerY(),field.right,field.centerY(),p);
            c.drawCircle(field.centerX(),field.centerY(),Math.min(field.width(),field.height())*.11f,p);
            c.drawRect(field.centerX()-field.width()*.19f,field.top,field.centerX()+field.width()*.19f,field.top+field.height()*.15f,p);
            c.drawRect(field.centerX()-field.width()*.19f,field.bottom-field.height()*.15f,field.centerX()+field.width()*.19f,field.bottom,p);

            for(Link l:links){
                if(!visible(l.a)||!visible(l.b))continue;
                float ax=px(l.a.x),ay=py(l.a.y),bx=px(l.b.x),by=py(l.b.y);
                p.setStyle(Paint.Style.STROKE); p.setStrokeWidth(5);
                if(l.score>=85)p.setColor(Color.rgb(90,220,120));
                else if(l.score>=75)p.setColor(Color.rgb(255,205,70));
                else p.setColor(Color.rgb(235,80,80));
                c.drawLine(ax,ay,bx,by,p);
                p.setStyle(Paint.Style.FILL); p.setTextSize(18); p.setColor(Color.WHITE);
                c.drawText(String.valueOf(l.score),(ax+bx)/2,(ay+by)/2,p);
            }

            for(Player x:players){
                if(!visible(x))continue;
                float X=px(x.x),Y=py(x.y);
                p.setStyle(Paint.Style.FILL);
                p.setColor(x.team.equals("Ajax")?Color.rgb(210,25,35):Color.rgb(35,45,150));
                c.drawCircle(X,Y,29,p);
                p.setStyle(Paint.Style.STROKE); p.setStrokeWidth(3); p.setColor(Color.WHITE); c.drawCircle(X,Y,29,p);
                p.setStyle(Paint.Style.FILL); p.setColor(Color.WHITE); p.setTextAlign(Paint.Align.CENTER);
                p.setTypeface(Typeface.DEFAULT_BOLD); p.setTextSize(14);
                String label=x.name.length()>11?x.name.substring(0,11):x.name;
                c.drawText(label,X,Y-36,p);
                p.setTextSize(13); c.drawText(x.role,X,Y+5,p);
                p.setTextSize(11); c.drawText(String.valueOf(x.rating),X,Y+20,p);
            }
            p.setTextAlign(Paint.Align.LEFT);
        }
        float px(float x){return field.left+x*field.width();}
        float py(float y){return field.top+y*field.height();}
        Player hit(float x,float y){Player best=null;for(Player q:players)if(visible(q)&&Math.hypot(x-px(q.x),y-py(q.y))<42)best=q;return best;}

        public boolean onTouchEvent(android.view.MotionEvent e){
            float x=e.getX(),y=e.getY();
            if(e.getAction()==MotionEvent.ACTION_DOWN){
                downAt=System.currentTimeMillis(); downPlayer=hit(x,y);
                if(linkMode && downPlayer!=null){ selectLink(downPlayer); return true; }
                drag=downPlayer;
                if(drag!=null){offX=x-px(drag.x);offY=y-py(drag.y);}
                return true;
            }
            if(e.getAction()==MotionEvent.ACTION_MOVE && drag!=null){
                drag.x=Math.max(0,Math.min(1,(x-offX-field.left)/field.width()));
                drag.y=Math.max(0,Math.min(1,(y-offY-field.top)/field.height())); invalidate(); return true;
            }
            if(e.getAction()==MotionEvent.ACTION_UP){
                if(downPlayer!=null && System.currentTimeMillis()-downAt>650) showProfile(downPlayer);
                drag=null;return true;
            }
            return true;
        }
        void toggleLinkMode(){linkMode=!linkMode;firstLink=null;status.setText(linkMode?"Koppelmodus: tik 2 spelers":"Sleepmodus");}
        void selectLink(Player q){
            if(firstLink==null){firstLink=q;status.setText("Kies speler voor koppeling met "+q.name);}
            else if(firstLink!=q){
                int base=(firstLink.rating+q.rating)/2;
                int bonus=(firstLink.team.equals(q.team)?3:-8);
                int score=Math.max(40,Math.min(95,base+bonus));
                Link old=getLink(firstLink,q);
                if(old==null)links.add(new Link(firstLink,q,score,"Handmatige koppeling"));
                else links.remove(old);
                status.setText(firstLink.name+" ↔ "+q.name+" • "+score+"/100");
                firstLink=null;invalidate();
            }
        }
        Link getLink(Player a,Player b){for(Link l:links)if((l.a==a&&l.b==b)||(l.a==b&&l.b==a))return l;return null;}
        void showProfile(Player q){
            new AlertDialog.Builder(getContext()).setTitle(q.name+" • "+q.role)
              .setMessage(q.team+"\nKwaliteit: "+q.rating+"/100\n\n"+q.profile)
              .setPositiveButton("OK",null).show();
        }
        void saveLayout(){
            SharedPreferences.Editor e=prefs.edit();
            for(Player q:players){e.putFloat(q.name+"_x",q.x);e.putFloat(q.name+"_y",q.y);} e.apply();
            status.setText("Opstelling opgeslagen");
        }
        void reset(){seed();invalidate();status.setText("Opstelling gereset");}
        protected void onSizeChanged(int w,int h,int ow,int oh){
            super.onSizeChanged(w,h,ow,oh);
            for(Player q:players){ if(prefs.contains(q.name+"_x")){q.x=prefs.getFloat(q.name+"_x",q.x);q.y=prefs.getFloat(q.name+"_y",q.y);} }
        }
    }
}
