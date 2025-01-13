import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Chamado } from 'src/app/models/chamados';
import { ChamadoService } from 'src/app/services/chamado.service';

@Component({
  selector: 'app-chamado-list',
  templateUrl: './chamado-list.component.html',
  styleUrls: ['./chamado-list.component.css']
})
export class ChamadoListComponent implements OnInit {

  ELEMENT_DATA: Chamado[] = []
  FILTERED_DATA: Chamado[] = []
  selectedStatus: number | null = null; // Variável para controlar o status selecionado
    
  displayedColumns: string[] = ['id', 'titulo', 'cliente', 'tecnico','dataAbertura', 'dataFechamento', 'prioridade', 'status', 'acoes'];
  dataSource = new MatTableDataSource<Chamado>(this.ELEMENT_DATA);
  
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private service: ChamadoService
  ) { }

  ngOnInit(): void {
    this.findAll();
  }

  findAll(): void {
    this.service.findAll().subscribe(resposta => {
      this.ELEMENT_DATA = resposta;
      this.dataSource = new MatTableDataSource<Chamado>(resposta);
      this.dataSource.paginator = this.paginator
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  retornaStatus(status: any): string {
    if (status === 0) {
      return 'ABERTO';
    } else if (status === 1) {
      return 'EM ANDAMENTO';
    } else {
      return 'ENCERRADO';
    } 
  }

  retornaPrioridade(prioridade: any): string {
    if (prioridade === 0) {
      return 'BAIXA';
    } else if (prioridade === 1) {
      return 'MÉDIA';
    } else {
      return 'ALTA';
    } 
  }

  orderByStatus(status: number): void {
    // Se o mesmo status foi clicado novamente, desmarque a seleção e resete os dados
    if (this.selectedStatus === status) {
      this.selectedStatus = null;
      this.FILTERED_DATA = this.ELEMENT_DATA; // Reseta o filtro
    } else {
      this.selectedStatus = status;
      // Converte o status de ambos os lados para números antes de comparar
      this.FILTERED_DATA = this.ELEMENT_DATA.filter(element => Number(element.status) === status);
    }
    // Atualiza a tabela com o filtro aplicado
    this.dataSource = new MatTableDataSource<Chamado>(this.FILTERED_DATA);
    this.dataSource.paginator = this.paginator;
  }
}
