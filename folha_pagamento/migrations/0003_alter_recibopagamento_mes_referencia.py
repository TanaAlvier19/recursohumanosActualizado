# folha_pagamento/migrations/0004_fix_mes_referencia.py
from django.db import migrations, models
from django.db.migrations.operations import RunPython

def convert_mes_referencia(apps, schema_editor):
    ReciboPagamento = apps.get_model('folha_pagamento', 'ReciboPagamento')
    
    for recibo in ReciboPagamento.objects.all():
        if recibo.mes_referencia:
            if hasattr(recibo.mes_referencia, 'month'):
                recibo.mes_referencia_int = recibo.mes_referencia.month
            elif isinstance(recibo.mes_referencia, int):
                recibo.mes_referencia_int = recibo.mes_referencia
            else:
                # Valor padrão caso não seja possível converter
                recibo.mes_referencia_int = 1
            recibo.save()

class Migration(migrations.Migration):

    dependencies = [
        ('folha_pagamento', '0003_alter_recibopagamento_mes_referencia'),
    ]

    operations = [
        # Primeiro, adicionar um campo temporário
        migrations.AddField(
            model_name='recibopagamento',
            name='mes_referencia_int',
            field=models.IntegerField(default=1),
        ),
        
        # Executar a conversão dos dados
        migrations.RunPython(convert_mes_referencia),
        
        # Remover o campo antigo
        migrations.RemoveField(
            model_name='recibopagamento',
            name='mes_referencia',
        ),
        
        # Renomear o novo campo
        migrations.RenameField(
            model_name='recibopagamento',
            old_name='mes_referencia_int',
            new_name='mes_referencia',
        ),
    ]