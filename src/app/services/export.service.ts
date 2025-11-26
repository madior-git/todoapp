import { Injectable } from '@angular/core';
import { Todo } from '../models/todo.model';
import { Person } from '../models/person.model';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  exportToExcel(todos: Todo[], filename: string = 'todos'): void {
    const data = todos.map(todo => ({
      'Titre': todo.titre,
      'Personne': todo.person.name,
      'Email': todo.person.email,
      'Priorité': todo.priority,
      'Technologies': todo.labels.join(', '),
      'Date Début': new Date(todo.startDate).toLocaleDateString('fr-FR'),
      'Date Fin': todo.endDate ? new Date(todo.endDate).toLocaleDateString('fr-FR') : 'En cours',
      'Description': todo.description,
      'Terminée': todo.completed ? 'Oui' : 'Non'
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    
    // Ajuster la largeur des colonnes
    const colWidths = [
      { wch: 30 }, // Titre
      { wch: 20 }, // Personne
      { wch: 25 }, // Email
      { wch: 10 }, // Priorité
      { wch: 20 }, // Technologies
      { wch: 12 }, // Date Début
      { wch: 12 }, // Date Fin
      { wch: 40 }, // Description
      { wch: 10 }  // Terminée
    ];
    worksheet['!cols'] = colWidths;

    XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  async exportToPDF(todos: Todo[], filename: string = 'todos'): Promise<void> {
    // Créer un élément HTML temporaire pour le PDF
    const element = document.createElement('div');
    element.style.padding = '20px';
    element.style.fontFamily = 'Arial, sans-serif';
    
    // Header du PDF
    const header = `
      <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px;">
        <h1 style="color: #333; margin: 0;">Liste des Tâches</h1>
        <p style="color: #666; margin: 5px 0;">Généré le ${new Date().toLocaleDateString('fr-FR')}</p>
        <p style="color: #666; margin: 0;">Total: ${todos.length} tâche(s)</p>
      </div>
    `;
    
    // Corps du PDF
    let body = '<table style="width: 100%; border-collapse: collapse;">';
    body += `
      <thead>
        <tr style="background-color: #f8f9fa;">
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Titre</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Personne</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Priorité</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Technologies</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Date Début</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Date Fin</th>
        </tr>
      </thead>
      <tbody>
    `;
    
    todos.forEach(todo => {
      const priorityClass = this.getPriorityClass(todo.priority);
      body += `
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">${todo.titre}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${todo.person.name}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">
            <span style="padding: 4px 8px; border-radius: 12px; font-size: 12px; ${priorityClass}">
              ${todo.priority}
            </span>
          </td>
          <td style="border: 1px solid #ddd; padding: 8px;">${todo.labels.join(', ')}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${new Date(todo.startDate).toLocaleDateString('fr-FR')}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${todo.endDate ? new Date(todo.endDate).toLocaleDateString('fr-FR') : 'En cours'}</td>
        </tr>
      `;
    });
    
    body += '</tbody></table>';
    element.innerHTML = header + body;

    // Ajouter au DOM temporairement
    document.body.appendChild(element);

    try {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
    } finally {
      // Nettoyer
      document.body.removeChild(element);
    }
  }

  private getPriorityClass(priority: string): string {
    switch (priority) {
      case 'Facile': return 'background-color: #d1fae5; color: #065f46;';
      case 'Moyen': return 'background-color: #fef3c7; color: #92400e;';
      case 'Difficile': return 'background-color: #fee2e2; color: #991b1b;';
      default: return 'background-color: #f3f4f6; color: #374151;';
    }
  }

  // NOUVELLES MÉTHODES POUR LES PERSONNES
    exportPersonsToExcel(persons: Person[], filename: string = 'personnes'): void {
      const data = persons.map(person => ({
        'Nom': person.name,
        'Email': person.email,
        'Téléphone': person.phone || 'Non renseigné',
        'Initiales': this.getInitials(person.name)
      }));
  
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      
      // Ajuster la largeur des colonnes
      const colWidths = [
        { wch: 25 }, // Nom
        { wch: 30 }, // Email
        { wch: 20 }, // Téléphone
        { wch: 10 }  // Initiales
      ];
      worksheet['!cols'] = colWidths;
  
      XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
    }
  
    async exportPersonsToPDF(persons: Person[], filename: string = 'personnes'): Promise<void> {
      // Créer un élément HTML temporaire pour le PDF
      const element = document.createElement('div');
      element.style.padding = '20px';
      element.style.fontFamily = 'Arial, sans-serif';
      element.style.backgroundColor = 'white';
      
      // Header du PDF
      const header = `
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #3b82f6; padding-bottom: 15px;">
          <h1 style="color: #1f2937; margin: 0; font-size: 24px;">Liste des Personnes</h1>
          <p style="color: #6b7280; margin: 5px 0; font-size: 14px;">Généré le ${new Date().toLocaleDateString('fr-FR')}</p>
          <p style="color: #6b7280; margin: 0; font-size: 14px;">Total: ${persons.length} personne(s)</p>
        </div>
      `;
      
      // Corps du PDF avec design amélioré
      let body = '<table style="width: 100%; border-collapse: collapse; font-size: 12px;">';
      body += `
        <thead>
          <tr style="background-color: #3b82f6; color: white;">
            <th style="border: 1px solid #1d4ed8; padding: 12px; text-align: left; width: 40px;">Avatar</th>
            <th style="border: 1px solid #1d4ed8; padding: 12px; text-align: left;">Nom</th>
            <th style="border: 1px solid #1d4ed8; padding: 12px; text-align: left;">Email</th>
            <th style="border: 1px solid #1d4ed8; padding: 12px; text-align: left;">Téléphone</th>
          </tr>
        </thead>
        <tbody>
      `;
      
      persons.forEach((person, index) => {
        const bgColor = index % 2 === 0 ? '#f8fafc' : '#ffffff';
        const initials = this.getInitials(person.name);
        
        body += `
          <tr style="background-color: ${bgColor};">
            <td style="border: 1px solid #e5e7eb; padding: 10px; text-align: center;">
              <div style="width: 32px; height: 32px; background-color: #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px; margin: 0 auto;">
                ${initials}
              </div>
            </td>
            <td style="border: 1px solid #e5e7eb; padding: 10px; font-weight: 500;">${person.name}</td>
            <td style="border: 1px solid #e5e7eb; padding: 10px; color: #6b7280;">${person.email}</td>
            <td style="border: 1px solid #e5e7eb; padding: 10px; color: #6b7280;">${person.phone || 'Non renseigné'}</td>
          </tr>
        `;
      });
      
      body += '</tbody></table>';
      element.innerHTML = header + body;
  
      // Ajouter au DOM temporairement
      document.body.appendChild(element);
  
      try {
        const canvas = await html2canvas(element, {
          scale: 2, // Meilleure qualité
          useCORS: true,
          logging: false
        });
        
        const imgData = canvas.toDataURL('image/png', 1.0);
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const imgWidth = 190; // Largeur réduite pour les marges
        const pageHeight = 277; // Hauteur A4 moins marges
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        let heightLeft = imgHeight;
        let position = 10; // Marge supérieure
  
        // Ajouter la première page
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
  
        // Pages supplémentaires si nécessaire
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight + 10;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
  
        pdf.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
      } catch (error) {
        console.error('Erreur lors de la génération du PDF:', error);
        alert('Erreur lors de l\'export PDF');
      } finally {
        // Nettoyer
        document.body.removeChild(element);
      }
    }
  
    // Méthode utilitaire pour les initiales
    private getInitials(name: string): string {
      return name.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
}